# **User & Role Management with .NET Core and Angular**

This project implements a basic User and Role Management system with a REST API built using .NET Core and a frontend application built with Angular. Data is stored in a PostgreSQL database running in a Docker container.

**The .NET Core API and the Angular frontend are designed to run directly on your local machine, while the database runs separately in Docker.**

## **Project Structure**

The project is organized into two main directories:

* UserRoleManagementApi: Contains the .NET Core REST API backend code.  
* user-role-frontend: Contains the Angular frontend application code.

## **Prerequisites**

Before you begin, ensure you have the following installed on your local machine:

* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)  
* [Angular CLI](https://angular.io/cli) (install globally via npm: npm install \-g @angular/cli)  
* [Docker](https://www.docker.com/get-started/) (Only needed for the database)  
* [Git](https://git-scm.com/downloads)

## **Getting Started**

Follow these steps to get the application components up and running on your local machine.

### **1\. Clone the Repository**

First, clone the project repository from GitHub:

git clone https://github.com/yourusername/your-repo-name.git  
cd your-repo-name \# Navigate into the project root directory

Replace yourusername and your-repo-name with your actual GitHub username and repository name.

### **2\. Set up and Start the Database (using Docker)**

The database runs in a Docker container.

1. **Start the PostgreSQL container:** If you don't have a container named userRoleDB already, run:  
   docker run \-p 5432:5432 \--env POSTGRES\_PASSWORD=password \--env POSTGRES\_USER=postgres\_user \--env POSTGRES\_DB=postgres\_db \--name userRoleDB \-d postgres

   If the container already exists but is stopped, start it with:  
   docker start userRoleDB

2. **Verify the container is running:**  
   docker ps

   You should see userRoleDB in the list of running containers.

### **3\. Configure and Run the Backend (.NET Core API)**

The backend API runs directly on your local machine and connects to the Dockerized database.

1. **Navigate to the API project directory:**  
   cd UserRoleManagementApi

2. Configure the database connection string:  
   Open the appsettings.json file and ensure the DefaultConnection string is set to connect to your Dockerized database on localhost:5432. From your local machine, the Docker-mapped port is accessed via localhost.  
   "ConnectionStrings": {  
     "DefaultConnection": "Host=localhost;Port=5432;Username=postgres\_user;Password=password;Database=postgres\_db;"  
   }

   Adjust Username, Password, and Database if you used different values in the docker run command.  
3. Apply Database Migrations:  
   Ensure you have the Entity Framework Core tools installed globally on your local machine:  
   dotnet tool install \--global dotnet-ef

   Then, apply the database migrations to create/update the necessary tables in your PostgreSQL database running in Docker:  
   dotnet ef database update

   You should see output indicating that migrations are being applied.  
4. Run the API:  
   Start the .NET Core API application directly on your local machine:  
   dotnet run

   The API should start and listen on a local address and port (e.g., http://localhost:5129). Note this address; your frontend will need it.

### **4\. Configure and Run the Frontend (Angular)**

The frontend runs directly on your local machine and connects to the locally running backend API.

1. **Open a new terminal window.**  
2. **Navigate to the frontend project directory:**  
   cd ../user-role-frontend \# Assuming you are in the API directory  
   \# Or navigate directly from the project root: cd user-role-frontend

3. **Install frontend dependencies:**  
   npm install

4. Configure the API URL:  
   Open the src/environments/environment.ts and src/environments/environment.prod.ts files. Update the apiUrl to match the address and port where your .NET API is running locally (noted in step 3.4).  
   export const environment \= {  
     production: false,  
     apiUrl: 'http://localhost:5129/api' // Update this to your API's actual address/port \+ /api  
   };

   Adjust the port (e.g., 5129, 5000, 5001\) and include /api if your API controllers are routed under that path.  
5. **Run the Angular development server:**  
   ng serve \--open

   This will start the Angular development server and open the application in your default web browser (usually at http://localhost:4200).

## **Usage**

With the Dockerized database, the locally running backend API, and the locally running frontend, you can now interact with the application through your web browser at http://localhost:4200.

* If you configured Swagger, you can access the API documentation at http://localhost:5129/swagger (replace 5129 with your API's port).

## **Stopping the Application Components**

* To stop the .NET API, go to the terminal where dotnet run is executing and press Ctrl \+ C.  
* To stop the Angular frontend, go to the terminal where ng serve is executing and press Ctrl \+ C.  
* To stop the PostgreSQL Docker container, open a terminal and run:  
  docker stop userRoleDB

## **Further Development**

* Implement Authentication and Authorization (Task 8\)  
* Add Unit and Integration Tests (Task 9\)  
* Set up a CI/CD Pipeline (Task 11\) \- Note: This would likely involve Dockerizing the API and potentially the frontend for deployment, but for local development, the current setup is fine.  
* Add more features to the frontend (Task 10\)  
* Implement remaining API endpoints (e.g., get all users with roles/posts)