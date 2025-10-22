# Horne Modernization

A modern Azure Functions application built with .NET 9.

## Project Structure

- **Horne.Functions.App** - Azure Functions application with .NET 9
- **Horne.Modernization.sln** - Solution file containing all projects

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [Visual Studio Code](https://code.visualstudio.com/) with Azure Functions extension (recommended)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HorneModernization
```

### 2. Restore Dependencies

```bash
dotnet restore
```

### 3. Run the Application Locally

```bash
func start
```

The Azure Functions runtime will start locally and display the available endpoints.

## Project Configuration

### Local Settings

The project includes a `local.settings.json` file for local development configuration. This file contains:

- **AzureWebJobsStorage**: Connection string for Azure Storage (set to development storage by default)
- **FUNCTIONS_WORKER_RUNTIME**: Set to "dotnet-isolated" for .NET 9

### Host Configuration

The `host.json` file contains Azure Functions host configuration settings.

## Development

### Adding New Functions

1. Create a new class in the project
2. Add the `[Function]` attribute to your method
3. Configure appropriate triggers (HTTP, Timer, etc.)

Example HTTP trigger function:

```csharp
[Function("HttpExample")]
public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
{
    return new OkObjectResult("Welcome to Azure Functions!");
}
```

### Building the Solution

```bash
dotnet build
```

### Running Tests

```bash
dotnet test
```

## Deployment

### Azure Deployment

1. Create an Azure Function App in the Azure portal
2. Configure deployment settings
3. Deploy using one of the following methods:
   - Azure CLI: `func azure functionapp publish <app-name>`
   - Visual Studio Code Azure Functions extension
   - GitHub Actions CI/CD

### Environment Variables

Make sure to configure the following in your Azure Function App settings:

- **AzureWebJobsStorage**: Connection string to your Azure Storage account
- Any custom application settings your functions require

## Project Dependencies

The project includes the following key dependencies:

- **Microsoft.Azure.Functions.Worker**: Azure Functions worker SDK
- **Microsoft.Azure.Functions.Worker.Sdk**: Build and publish support
- **Microsoft.Azure.Functions.Worker.Extensions.Http**: HTTP trigger support

## Resources

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [.NET 9 Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [Azure Functions Best Practices](https://docs.microsoft.com/en-us/azure/azure-functions/functions-best-practices)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.