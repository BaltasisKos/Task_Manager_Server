# Task Manager Server

Task Manager is a final exam project for Coding Factory 7 of Athens Univercity of Economic Bussines. A modern React application designed to manage personal or team tasks in an intuitive and efficient way. It provides a user-friendly interface to create, update, and organize tasks, with real-time syncing via an API backend.

---

## Table of Contents

- [Overview](#overview)  
- [Technology Stack](#technology-stack)  
- [Setup & Development](#setup--development)  
- [Project Structure](#project-structure)  
- [How to Use (API)](#how-to-use-api)  
- [Deployment](#deployment)  
- [Build](#build)  


---

## Overview

This is the **backend server** for the Task Manager application, implementing a RESTful API to manage tasks (create, read, update, delete) and serve as the data layer for the React client. API endpoints are structured using Express-style routing, supported by models, controllers, services, middleware, utilities, and Swagger documentation.

---

## Technology Stack

- Node.js & Express.js  
- JavaScript  
- MongoDB (Database)  
- Swagger (API documentation)  

---

## Build & Development

**Clone the repository**

   ```bash
   git clone https://github.com/BaltasisKos/Task_Manager_Server.git
   cd Task_Manager_Server
   ```

## Environment variables
First, create the environment variables file `.env` in the server folder. The `.env` file contains the following environment variables:

- MONGODB_URI = `your MongoDB URL`
- JWT_SECRET = `any secret key - must be secured`
- PORT = `5000` or any port number
- NODE_ENV = `development`


&nbsp;

## Set Up MongoDB:

1. Setting up MongoDB involves a few steps:
    - Visit MongoDB Atlas Website
        - Go to the MongoDB Atlas website: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).

    - Create an Account
    - Log in to your MongoDB Atlas account.
    - Create a New Cluster
    - Choose a Cloud Provider and Region
    - Configure Cluster Settings
    - Create Cluster
    - Wait for Cluster to Deploy
    - Create Database User
    - Set Up IP Whitelist
    - Connect to Cluster
    - Configure Your Application
    - Test the Connection

2. Create a new database and configure the `.env` file with the MongoDB connection URL. 

## Steps to run server

1. Open the project in any editor of choice.
2. Navigate into the server directory `cd server`.
3. Run `npm i` or `npm install` to install the packages.
4. Run `npm start` to start the server.



## Project Structure

```
Task_Manager_Server/
├── controller/        # Handles business logic per endpoint
├── middleware/        # Custom request-handling middleware
├── models/            # Data models (e.g., Task schema)
├── routes/            # API route definitions
├── services/          # Service layer (e.g., DB interactions)
├── utils/             # Utility/helper functions
├── .gitignore
├── index.js           # Server entry point
├── package.json
├── package-lock.json
├── swagger.js         # Swagger API configuration
└── README.md
```

---

## How to Use (API)

1. **Create a Task**  
   Send a `POST` request to `/tasks` with the appropriate JSON payload (e.g., title, description, status, priority).

2. **Retrieve Tasks**  
   Send a `GET` request to `/tasks` for all tasks or `/tasks/:id` for a specific task.

3. **Update a Task**  
   Use `PUT` or `PATCH` to `/tasks/:id` with updated task details in the payload.

4. **Delete a Task**  
   Send a `DELETE` request to `/tasks/:id`.

Use tools like Postman, Insomnia, or cURL to test the API during development.

---

