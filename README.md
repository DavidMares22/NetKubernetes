# NetKubernetesAngular

This is a full-stack project that combines an **Angular frontend** and an **ASP.NET Core backend** to provide a complete solution for managing properties and user authentication. The project is designed to be containerized and deployed in a Kubernetes cluster.

---

## Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Frontend (Angular)](#frontend-angular)
- [Backend (.NET)](#backend-net)
- [Deployment](#deployment)

---

## Overview

The **NetKubernetesAngular** project is a property management system that allows users to:
- Register and log in using JWT-based authentication.
- Manage properties (CRUD operations).
- View and interact with a responsive user interface built with Angular.
- Use a RESTful API for backend operations.

The project is designed to be scalable, maintainable, and ready for deployment in a Kubernetes cluster.

---

## Technologies Used

### Frontend
- **Angular**: Framework for building the user interface.
- **RxJS**: For state management and reactive programming.
- **NgRx**: For advanced state management.

### Backend
- **ASP.NET Core**: Framework for building the RESTful API.
- **Entity Framework Core**: For database access and migrations.
- **JWT**: For secure user authentication.

### DevOps
- **Docker**: For containerization.
- **Kubernetes**: For orchestration and deployment.

---

## Project Structure

The project is divided into two main parts:

1. **Frontend**:
   - Located in the `Frontend/inmueble-client` folder.
   - Built with Angular and follows a modular architecture.

2. **Backend**:
   - Located in the `NetKubernetesAngular` folder.
   - Built with ASP.NET Core and follows a clean architecture pattern.

---

## Getting Started

### Prerequisites
Make sure you have the following installed:
- **Node.js** (for the frontend)
- **Angular CLI** (for building and running the frontend)
- **.NET SDK** (for the backend)
- **SQL Server** or another supported database
- **Docker** (for containerization)
- **Kubernetes** (optional, for deployment)

---

## Frontend (Angular)

### Features
- User authentication with JWT.
- Property management (CRUD operations).
- Responsive design for desktop and mobile.

### Setup
1. Navigate to the frontend folder:
   ```bash
   cd Frontend/inmueble-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   ng serve
   ```
   The application will be available at `http://localhost:4200`.

4. Build for production:
   ```bash
   ng build --configuration production
   ```

For more details, see the [Frontend README](Frontend/inmueble-client/README.md).

---

## Backend (.NET)

### Features
- JWT-based authentication.
- RESTful API for managing properties and users.
- Database integration with Entity Framework Core.
- Automatic data seeding on startup.

### Setup
1. Navigate to the backend folder:
   ```bash
   cd NetKubernetesAngular
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Apply database migrations:
   ```bash
   dotnet ef database update
   ```

4. Run the application:
   ```bash
   dotnet run
   ```
   The API will be available at `http://localhost:5000`.

For more details, see the [Backend README](NetKubernetesAngular/README.md).

---

## Deployment

### Docker
The project includes Docker support for both the frontend and backend.

1. Build the Docker images:
   ```bash
   docker build -t inmueble-client ./Frontend/inmueble-client
   docker build -t netkubernetesangular ./NetKubernetesAngular
   ```

2. Run the containers:
   ```bash
   docker run -p 4200:4200 inmueble-client
   docker run -p 5000:5000 netkubernetesangular
   ```

### Kubernetes
To deploy the project in a Kubernetes cluster:
1. Create Kubernetes deployment and service YAML files for both the frontend and backend.
2. Apply the configurations:
   ```bash
   kubectl apply -f frontend-deployment.yaml
   kubectl apply -f backend-deployment.yaml
   ```

3. Expose the services using a LoadBalancer or Ingress.

---

## Additional Resources

- [Frontend Documentation](Frontend/inmueble-client/README.md)
- [Backend Documentation](NetKubernetesAngular/README.md)
- [Angular CLI Documentation](https://angular.io/cli)
- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

---

Let me know if you'd like further customization or additional sections!
