# NetKubernetesAngular

This is the backend application for the **NetKubernetesAngular** project, built with **ASP.NET Core**. The application provides APIs for managing properties, user authentication, and other business logic. It is designed to work seamlessly with the Angular frontend application.

---

## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Environment Configuration](#environment-configuration)
- [Database Setup and Data Import](#database-setup-and-data-import)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)

---

## Getting Started

### Prerequisites
Make sure you have the following installed:
- [.NET SDK](https://dotnet.microsoft.com/download) (version 7.0 or higher recommended)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or another supported database
- [Postman](https://www.postman.com/) (optional, for testing APIs)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/NetKubernetesAngular.git
   cd NetKubernetesAngular
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Build the project:
   ```bash
   dotnet build
   ```

---

## Project Structure

The project follows a clean architecture pattern to ensure scalability and maintainability. Below is an overview of the key folders:

- **Controllers**: Contains API controllers that handle HTTP requests and responses.
- **Data**: Includes the `AppDbContext` for Entity Framework Core, database-related logic, and the `LoadDatabase` class for seeding data.
- **Models**: Defines the data models used throughout the application.
- **Services**: Contains business logic and reusable services.
- **Helpers**: Includes utility classes for tasks like JWT generation and password hashing.
- **Middleware**: Custom middleware for handling exceptions, logging, and authentication.

---

## Key Features

1. **User Authentication**:
   - Implements JWT-based authentication.
   - Supports user registration, login, and role-based authorization.

2. **Property Management**:
   - CRUD operations for managing properties (e.g., houses, apartments).
   - Includes endpoints for creating, updating, deleting, and retrieving property data.

3. **Database Integration**:
   - Uses Entity Framework Core for database access.
   - Supports migrations for schema updates.

4. **RESTful API Design**:
   - Follows RESTful principles for API design.
   - Includes proper HTTP status codes and error handling.

5. **Kubernetes-Ready**:
   - Configured for containerization and deployment in Kubernetes clusters.
   - Includes Docker support for building and running the application in containers.

---

## Environment Configuration

The application uses an `appsettings.json` file for configuration. Below is an example of how it should look:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=NetKubernetesAngular;User Id=sa;Password=your_password;"
  },
  "Jwt": {
    "Key": "your_jwt_secret_key",
    "Issuer": "NetKubernetesAngular",
    "Audience": "NetKubernetesAngularUsers"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

### Key Configuration Sections:
- **ConnectionStrings**: Specifies the database connection string.
- **Jwt**: Contains settings for JWT authentication, including the secret key, issuer, and audience.
- **Logging**: Configures logging levels for the application.

---

## Database Setup and Data Import

### Database Setup
1. Update the database connection string in `appsettings.json` to match your database configuration.

2. Apply migrations to set up the database schema:
   ```bash
   dotnet ef database update
   ```

### Data Import
When the application is run, it automatically seeds the database with initial data using the `LoadDatabase` class. This includes:
1. **Default User**:
   - A user with the following details is created:
     - **Name**: Dave More
     - **Email**: `DaveMore@gmail.com`
     - **Username**: `dave.more`
     - **Password**: `Password123!`

2. **Sample Properties**:
   - Two sample properties are added to the database:
     - **Casa de Playa**:
       - Address: `Av. El Sol 32`
       - Price: `4500`
     - **Casa de Invierno**:
       - Address: `Av. La Roca 101`
       - Price: `3500`

This process is handled in the `Program.cs` file during application startup:
```csharp
Task.Run(async () =>
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;

        try
        {
            var userManager = services.GetRequiredService<UserManager<Usuario>>();
            var context = services.GetRequiredService<AppDbContext>();
            await context.Database.MigrateAsync();
            await LoadDatabase.InsertarData(context, userManager);
        }
        catch (Exception e)
        {
            var logging = services.GetRequiredService<ILogger<Program>>();
            logging.LogError(e, "An error occurred during migration");
        }
    }
}).GetAwaiter().GetResult();
```

---

## API Endpoints

### Authentication
- **POST** `/api/usuario/login`: Authenticate a user and return a JWT token.
- **POST** `/api/usuario/registrar`: Register a new user.
- **GET** `/api/usuario`: Retrieve the currently authenticated user's details.

### Properties
- **GET** `/api/inmueble`: Retrieve all properties.
- **GET** `/api/inmueble/{id}`: Retrieve a property by ID.
- **POST** `/api/inmueble`: Create a new property.
- **DELETE** `/api/inmueble/{id}`: Delete a property.

---

## Running the Application

1. Run the application:
   ```bash
   dotnet run
   ```

2. The application will be available at `http://localhost:5000` by default.

3. Use tools like Postman or your Angular frontend to test the APIs.

---

## Deployment

### Docker
The project includes a `Dockerfile` for containerization. To build and run the application in a Docker container:

1. Build the Docker image:
   ```bash
   docker build -t netkubernetesangular .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 5000:5000 netkubernetesangular
   ```

### Kubernetes

To deploy the application in a Kubernetes cluster:

1. Apply the pod configuration:
   ```bash
   kubectl apply -f Kubernetes/app-pod.yml
   ```

   Delete the pod if needed:
   ```bash
   kubectl delete pod app-pod
   ```

2. Verify the pod is running:
   ```bash
   kubectl get pods
   ```

3. Forward the port to access the application:
   ```bash
   kubectl port-forward pod/app-pod 5000:5000
   ```

4. Check the pod logs:
   ```bash
   kubectl logs app-pod
   ```

The application will be accessible at `http://localhost:5000`.

---