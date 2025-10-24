# Horne Modernization

A modern Azure Functions application built with .NET 9.

## Project Structure

- **Horne.Functions.App** - Azure Functions application with .NET 9
- **Horne.Modernization.sln** - Solution file containing all projects
- **Functions/** - Directory containing all Azure Function implementations
  - **HttpTriggerFunction.cs** - HTTP-triggered functions for API endpoints
  - **TimerTriggerFunction.cs** - Timer-triggered functions for scheduled tasks
  - **BlobTriggerFunction.cs** - Blob-triggered functions for file processing
  - **QueueTriggerFunction.cs** - Queue-triggered functions for message processing

## Available Functions

### HTTP Trigger Functions

- **GetWelcomeMessage** - `GET /api/GetWelcomeMessage` - Returns welcome message with environment info
- **CreateUser** - `POST /api/CreateUser` - Creates a new user with validation
- **GetUserById** - `GET /api/users/{id}` - Retrieves user information by ID
- **HealthCheck** - `GET /api/HealthCheck` - Health check endpoint (anonymous access)

### Timer Trigger Functions

- **DataProcessingJob** - Runs every 5 minutes for data processing
- **DailyReportGeneration** - Runs daily at 2 AM for report generation
- **WeeklyCleanupJob** - Runs every Monday at 9 AM for cleanup tasks
- **MonthlyArchiveJob** - Runs on the first day of each month for archival

### Blob Trigger Functions

- **ProcessUploadedImage** - Processes images uploaded to `images/` container
- **ProcessUploadedDocument** - Processes documents uploaded to `documents/` container
- **ArchiveOldFiles** - Archives files older than 30 days from `temp/` container

### Queue Trigger Functions

- **ProcessEmailQueue** - Processes email requests from `email-queue`
- **ProcessNotificationQueue** - Processes notifications from `notification-queue`
- **ProcessOrderQueue** - Processes orders from `order-processing` queue

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
- **Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore**: HTTP trigger support
- **Microsoft.Azure.Functions.Worker.Extensions.Timer**: Timer trigger support
- **Microsoft.Azure.Functions.Worker.Extensions.Storage.Blobs**: Blob trigger support
- **Microsoft.Azure.Functions.Worker.Extensions.Storage.Queues**: Queue trigger support

## Testing Functions Locally

To test the functions locally, you can use tools like:

- **HTTP Functions**: Use curl, Postman, or browser for GET requests
- **Timer Functions**: Will run automatically based on their schedule
- **Blob Functions**: Upload files to the local storage emulator containers
- **Queue Functions**: Add messages to queues using Azure Storage Explorer

### Example HTTP Requests

```bash
# Health check
curl http://localhost:7071/api/HealthCheck

# Get welcome message
curl http://localhost:7071/api/GetWelcomeMessage

# Create user
curl -X POST http://localhost:7071/api/CreateUser \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Get user by ID
curl http://localhost:7071/api/users/12345678-1234-1234-1234-123456789012
```

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
