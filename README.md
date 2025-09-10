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

## Setup & Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/BaltasisKos/Task_Manager_Server.git
   cd Task_Manager_Server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm start
   ```

4. **Access API documentation**

   If Swagger is configured, navigate to the appropriate route (e.g., `/api-docs`) to view the API specification.

---

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

## Deployment

1. Ensure environment variables are set (e.g., MongoDB connection string, PORT).  
2. Run a production deployment with:

   ```bash
   NODE_ENV=production npm start
   ```

3. Deploy to your hosting platform of choice (e.g., Heroku, AWS, DigitalOcean) following their specific Node.js deployment flow.

---

## Build

This project is server‑side JavaScript; no build step is required unless you transpile with Babel or use TypeScript. Run:

- **Development**:  
  ```bash
  npm run dev
  ```
- **Production**:  
  ```bash
  npm start
  ```

