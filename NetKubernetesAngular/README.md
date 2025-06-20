# NetKubernetesAngular

built with **ASP.NET Core**. The application provides endpoints for managing properties, user authentication and user registration. It uses Entity Framework as ORM.

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
- [SSL Certificale](#ssl-certificate)

---

## Getting Started

### Prerequisites
 

 
 

 

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
We need to have two containers running netkubernetesangular:latest for the Web API and
inmuebleclient:latest for the Angular SPA

1. Build the Docker image:
   ```bash
   docker build -t netkubernetesangular:latest -f Dockerfile --platform linux/amd64 .
   docker build -t inmuebleclient .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 5000:5000 netkubernetesangular
   docker run -p 8090:80 inmuebleclient
   ```

### Kubernetes

To deploy the application in a Kubernetes cluster:
1. make sure you are in this address NetKubernetesAngular\Kubernetes
2. make sure you create 2 domain names in your hosts file
   127.0.0.1 app.local
   127.0.0.1 front.local



Delete all pods, services and deployments:
```bash
kubectl delete all --all -n app
kubectl delete --all pods --namespace=default
kubectl delete --all services --namespace=default
kubectl delete --all deployments --namespace=default

```

Delete the app namespace and recreate
```bash
kubectl delete namespace app
kubectl get namespaces
kubectl create namespace app
```

delete ingress
```bash
kubectl delete ingress app-ingress -n app

```

Delete the ingress controller
```bash
kubectl get pods -n ingress-nginx
kubectl delete all --all -n ingress-nginx
```

install ingress controller
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.2/deploy/static/provider/cloud/deploy.yaml
```

edit the ingress controller http port from 80 to 8086 because IIS is already using port 80
```bash
kubectl edit svc ingress-nginx-controller -n ingress-nginx
```


If you want to forward a service or pod
```bash
kubectl port-forward svc/app-service 5001:5000 -n app
kubectl port-forward pod/app-pod 5000:5000
```


Create the deployment configuration:
```bash
kubectl create -f sqlserver-deploy.yml
kubectl create -f sqlserver-service.yml
kubectl create -f app-deploy.yml
kubectl create -f app-service.yml

kubectl create -f angular-deploy.yml
kubectl create -f angular-service.yml

kubectl apply -f app-ingress.yml
```
 





Verify the pod is running:
```bash
kubectl get pod,svc,deployments -n app
kubectl get ingress -n app
```

 
Check the pod logs:
```bash
kubectl logs app-pod
```

The application will be accessible at `http://front.local:8086`.

---

## SSL Certificate

reference link
```bash
https://youtu.be/IQ3G8Z1myMw?list=PLVkLxPPyoo_Zeb7C0yjaP6BBcyvP1LffA
```

1. tools
cert-manager :  adds certificates and certificate issuers types in Kubernetes clusters
		we use it to managed self signed certificates created manually

openssl : command line tool to create certificates


2. generate a private key for the certificate authority

```bash
	
	openssl genrsa -out ca.key 4096
```
3. generate a certificate from the key
```bash
	openssl req -new -x509 -days 10950 -key ca.key -out ca.crt
```

save the ca.crt and ca.key in a desktop forlder called certs
trust the certificate on windows by doble click and import it into Trusted Root Certification Authority and save


4. now we start importing the certificate into cert manager
for this we need a cluster Issuer object, to generate and manage certificates inside Kubernetes (ngnx1-clusterIssuer.yml)

5. we need to create a Secret object (nginx-ca-sercret.yml) using the same namespace as cert-manager to contain the cert and key file in Base64, for this we can use the following command in power shell

```bash
[Convert]::ToBase64String([IO.File]::ReadAllBytes(".\ca.crt"))
[Convert]::ToBase64String([IO.File]::ReadAllBytes(".\ca.key"))
```

6. and then we need to apply the secret object and the cluster issuer into the cluster with kubectl apply

7. now we need a certificate object in the namespace of the other pods (app) , we need to define the host names, that also need to match with host names in the ingress and add a reference to the clister issuer object

8. then we can apply the certificate object and run kubectl get cert to verify kubectl describe cert

9. now we need to add to ingress the tls section with hosts and secret name

10. now when we access to https://front.local we dont get a warning for insecure conexion any more
