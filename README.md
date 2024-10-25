
# Restaurant Management API

## Project Overview

The RESTaurant API provides digital menu and online ordering solutions for restaurants. It’s designed to be intuitive and user-friendly, optimizing the user experience and saving time for both customers and restaurant staff.

The API includes the following features:

- Secure access using basic authentication with two roles: admin and client
- A MySQL database for data storage
- A back-end server using Express.js and MySQL

## Prerequisites

1. **Docker** : on l'utilise pour gérer la base de données MySQL et phpMyAdmin.  On utilise également Docker. [Télécharger Docker](https://www.docker.com/products/docker-desktop)
2. **Node.js** : L'API est construite avec Node.js. [Installer Node.js](https://nodejs.org/en)
3. **Postman** : on l'utilise pour tester les routes de l'API. On télécharge Postman afin de pouvoir tester les routes configurées.

 

## Installation and Setup

### 1. Clone the Repository

```bash
git clone git@github.com:B3ANQ/RESTaurant-API.git
cd <DIRECTORY_NAME>
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file at the root of the project and set it up with MySQL connection details:

```
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = teo
DB_NAME = restaurantapi
DB_PORT = 3307
```

### 4. Setting Up the Database with Docker

Use Docker to create a MySQL container and a phpMyAdmin container to manage your database.

#### a. Start MySQL and phpMyAdmin with Docker Compose

Create a `docker-compose.yml` file at the root of the project with the following content:

```yaml
services:
  phpmyadmin:
    container_name: restaurant-phpmyadmin
    image: phpmyadmin
    environment:
      - PMA_HOST=restaurant-database
    ports:
      - "6060:80"
    networks:
      - restaurant-network

  database:
    container_name: restaurant-database
    image: mariadb
    environment:
      - MARIADB_ROOT_PASSWORD=teo
    ports:
      - "3307:3306"
    networks:
      - restaurant-network

networks:
  restaurant-network:
```

Then, run the following command to start the containers:

```bash
docker-compose up -d
```

- **MySQL** will be available on port `3306`.
- **phpMyAdmin** can be accessed via `http://localhost:6060`.

### 5. Start the API

```bash
npm start
```

The API will be available at `http://localhost:3000`.

## API Routes

### Authentication

Some routes require basic authentication via an `Authorization` header with a Base64-encoded username and password. Two user types are available:

- **admin**: Administrator user (`admin:adminpass`)
- **client**: Username and password empty

### Public Routes

- `/`: Returns a welcome message.

### Client-Specific Routes

- `/client-test`: Returns a greeting message for the client.
- `/admin-test`: Returns a greeting message for the admin or a forbidden access message if applicable.

### Item Routes

- `GET /items`: Retrieves all items. (Admin/Client access)
- `GET /items/search/:name`: Searches for an item by name. (Admin/Client access)
- `POST /items`: Adds a new item. (Admin only)
- `GET /items/:id`: Retrieves an item by ID. (Admin/Client access)
- `PUT /items/:id`: Updates an item by ID. (Admin only)
- `DELETE /items/:id`: Deletes an item by ID. (Admin only)

### Category Routes

- `GET /categories`: Retrieves all categories. (Admin/Client access)
- `POST /categories`: Adds a new category. (Admin only)
- `GET /categories/:id`: Retrieves a category by ID. (Admin/Client access)
- `PUT /categories/:id`: Updates a category by ID. (Admin only)
- `DELETE /categories/:id`: Deletes a category by ID. (Admin only)

### Formula Routes

- `GET /formulas`: Retrieves all formulas. (Admin/Client access)
- `POST /formulas`: Adds a new formula. (Admin only)
- `GET /formulas/:id`: Retrieves a formula by ID with its categories and items. (Admin/Client access)
- `PUT /formulas/:id`: Updates a formula by ID. (Admin only)
- `DELETE /formulas/:id`: Deletes a formula by ID. (Admin only)

## Using phpMyAdmin

phpMyAdmin can be accessed via `http://localhost:6060`. Use the following credentials to log in:

- **User**: `root`
- **Password**: `teo`

You can manage the MySQL `restaurant_db` database here.

## Docker

To stop the Docker containers, run:

```bash
docker-compose down
```
---
© 2024 - Restaurant API


