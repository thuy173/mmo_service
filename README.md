# Web Application Project

This is a full-stack web application built with **React.js** and **TypeScript** on the front-end using **Vite** for fast development, and **Spring Boot** on the backend for serving APIs.

## Features

- **Frontend:**

  - Built with React.js + TypeScript
  - Vite for fast build and development
  - Component-based architecture
  - Routing with React Router
  - State management using React hooks or any state management library like Redux (optional)

- **Backend:**

  - Built with Spring Boot
  - RESTful API endpoints
  - JPA for database interaction (optional)
  - Security features with Spring Security (optional)
  - MySQL
  - MongoDB
  - Lombok (Optional, for reducing boilerplate code)
  - Maven or Gradle for build management

## Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm
- Java (JDK 11 or higher)
- Maven (if not using Spring Boot's built-in build system)
- MySQL - Ensure MySQL is installed and running.
- MongoDB - Ensure MongoDB is installed and running.
- Postman or Curl - For testing the API endpoints.

## Getting Started

### Frontend Setup

1. **Clone the repository:**

   git clone https://github.com/thao3210/MMOPanthers.git

   cd mmo-admin-site or cd mmo-site

2. Install dependencies:

   npm install

3. Run the development server:

   npm run dev

### Backend Setup

1. **Clone the repository:**

   git clone https://github.com/thao3210/MMOPanthers.git

2. Database Setup:

**Create database MySQL:**

   CREATE DATABASE mmo_db;

**MongoDB**
    MongoDB will automatically create a database if it does not exist, but you can explicitly create it

3. Run swagger html

   http://localhost:8811/swagger-ui/index.html#/
