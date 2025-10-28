using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Horne.Web.API.Authentication;

public static class KeycloakAuthenticationExtensions
{
    private const string TransformationMarkerType = "horne:keycloak-roles-transformed";

    public static IServiceCollection AddKeycloakAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<KeycloakOptions>(configuration.GetSection(KeycloakOptions.SectionName));

        var options = configuration.GetSection(KeycloakOptions.SectionName).Get<KeycloakOptions>() ?? new KeycloakOptions();

        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
        JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, bearerOptions =>
            {
                bearerOptions.RequireHttpsMetadata = options.RequireHttpsMetadata;

                if (!string.IsNullOrWhiteSpace(options.Authority))
                {
                    bearerOptions.Authority = options.Authority.TrimEnd('/');
                }

                if (!string.IsNullOrWhiteSpace(options.MetadataAddress))
                {
                    bearerOptions.MetadataAddress = options.MetadataAddress;
                }

                if (!string.IsNullOrWhiteSpace(options.Audience))
                {
                    bearerOptions.Audience = options.Audience;
                }

                bearerOptions.TokenValidationParameters = BuildTokenValidationParameters(options);

                bearerOptions.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        context.NoResult();
                        context.Response.StatusCode = 401;
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddSingleton<IClaimsTransformation>(sp => new KeycloakRolesClaimsTransformation(TransformationMarkerType));

        return services;
    }

    private static TokenValidationParameters BuildTokenValidationParameters(KeycloakOptions options)
    {
        var parameters = new TokenValidationParameters
        {
            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role,
            ValidateIssuer = !string.IsNullOrWhiteSpace(options.Authority)
        };

        if (!string.IsNullOrWhiteSpace(options.ClientId) && string.IsNullOrWhiteSpace(options.Audience))
        {
            parameters.ValidAudience = options.ClientId;
        }
        else if (!string.IsNullOrWhiteSpace(options.Audience))
        {
            parameters.ValidAudience = options.Audience;
        }

        if (!string.IsNullOrWhiteSpace(options.Authority))
        {
            parameters.ValidIssuer = options.Authority.TrimEnd('/');
        }

        return parameters;
    }

    private sealed class KeycloakRolesClaimsTransformation : IClaimsTransformation
    {
        private readonly string _markerClaimType;

        public KeycloakRolesClaimsTransformation(string markerClaimType)
        {
            _markerClaimType = markerClaimType;
        }

        public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            if (principal.Identity is not ClaimsIdentity identity || !identity.IsAuthenticated)
            {
                return Task.FromResult(principal);
            }

            if (identity.HasClaim(claim => claim.Type == _markerClaimType))
            {
                return Task.FromResult(principal);
            }

            var existingRoles = new HashSet<string>(identity.FindAll(identity.RoleClaimType).Select(claim => claim.Value));

            ExtractRealmRoles(identity, existingRoles);
            ExtractResourceRoles(identity, existingRoles);

            identity.AddClaim(new Claim(_markerClaimType, bool.TrueString, ClaimValueTypes.Boolean));

            return Task.FromResult(principal);
        }

        private static void ExtractRealmRoles(ClaimsIdentity identity, ISet<string> existingRoles)
        {
            foreach (var claim in identity.FindAll("realm_access"))
            {
                if (string.IsNullOrWhiteSpace(claim.Value))
                {
                    continue;
                }

                try
                {
                    using var document = JsonDocument.Parse(claim.Value);
                    if (document.RootElement.TryGetProperty("roles", out var rolesElement))
                    {
                        AddRoles(identity, existingRoles, rolesElement);
                    }
                }
                catch (JsonException)
                {
                    // Ignore malformed JSON content.
                }
            }
        }

        private static void ExtractResourceRoles(ClaimsIdentity identity, ISet<string> existingRoles)
        {
            foreach (var claim in identity.FindAll("resource_access"))
            {
                if (string.IsNullOrWhiteSpace(claim.Value))
                {
                    continue;
                }

                try
                {
                    using var document = JsonDocument.Parse(claim.Value);
                    foreach (var client in document.RootElement.EnumerateObject())
                    {
                        if (client.Value.ValueKind == JsonValueKind.Object && client.Value.TryGetProperty("roles", out var rolesElement))
                        {
                            AddRoles(identity, existingRoles, rolesElement);
                        }
                    }
                }
                catch (JsonException)
                {
                    // Ignore malformed JSON content.
                }
            }
        }

        private static void AddRoles(ClaimsIdentity identity, ISet<string> existingRoles, JsonElement rolesElement)
        {
            if (rolesElement.ValueKind != JsonValueKind.Array)
            {
                return;
            }

            foreach (var roleElement in rolesElement.EnumerateArray())
            {
                var role = roleElement.GetString();
                if (!string.IsNullOrWhiteSpace(role) && existingRoles.Add(role))
                {
                    identity.AddClaim(new Claim(identity.RoleClaimType, role));
                }
            }
        }
    }
}
