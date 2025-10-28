namespace Horne.Web.API.Authentication;

public sealed class KeycloakOptions
{
    public const string SectionName = "Keycloak";

    public string Authority { get; set; } = string.Empty;

    public string? MetadataAddress { get; set; }

    public string? Audience { get; set; }

    public string? ClientId { get; set; }

    public bool RequireHttpsMetadata { get; set; } = true;
}
