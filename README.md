# Content Management System (CMS)

## Overview

**Currently in Development**

This project is a Content Management System (CMS) built with Node.js, Express, and MySQL, designed to facilitate the creation, management, and distribution of digital content. The application provides a user-friendly interface and a robust backend for managing various types of content efficiently.

## Features

- **User Authentication**: Secure user login and registration using JWT.
- **CRUD Operations**: Create, Read, Update, and Delete content effortlessly.
- **Role-Based Access Control**: Different access levels for admins and regular users.
- **Dynamic Content Management**: Manage various content types like articles, images, and videos.
- **Responsive Design**: A responsive front-end that works on various devices.
- **API Integration**: Easily integrate with other services using RESTful APIs.

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express**: A minimal and flexible Node.js web application framework for building APIs.
- **MySQL**: A powerful relational database management system to store content data.
- **Cors**: Middleware for enabling CORS (Cross-Origin Resource Sharing).
- **BcryptJS**: A library for securely hashing passwords to protect user data.
- **EJS**: Embedded JavaScript templating engine that enables dynamic HTML page generation with JavaScript.
- **JsonWebToken**: A library for generating and verifying JSON Web Tokens (JWT) for secure user authentication.

## Installation

You can easily run your project using Docker. Follow the steps below to set up and start your application.

### Prerequisites

- Make sure you have [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.

### Installation Steps

1. **Clone the Repository:**

   Open your terminal and run the following command to clone the project:

   ```bash
   git clone https://github.com/SepoHacks/SepoCMS.git

   cd SepoCMS
   ```

2. **Build the Docker Image:**

   In the project directory, create the Docker image by running:

   ```bash
   docker compose build
   ```

3. **Start the Services:**

   Use the following command to start the necessary services:

   ```bash
   docker compose up
   ```

4. **Access the Project:**

   Once the services are running, you can access your project in your web browser at `http://localhost:80` (or the relevant port).

## Additional Commands

- **Run Services in Detached Mode:**

  If you want to run the services in the background, you can use:

  ```bash
  docker compose up -d
  ```

- **Stop the Services:**

  To stop the running services, simply run:

  ```bash
  docker compose down
  ```

## Notes

- Changes made inside the containers may not be persistent, so be sure to take the necessary steps to properly manage your data.

- For further configuration or modifications, check the docker-compose.yml file.

- The first user added will automatically have the admin role and will have access to the dashboard.

If you successfully run your project and have any questions or suggestions, feel free to reach out!

```txt
Feel free to customize it as needed!
```
