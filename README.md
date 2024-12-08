# SmileMart(Inventory Service)

[SmileMart-Inventory-Url](https://smilemart-inventory-service.onrender.com)

## Project Overview
SmileMart(Inventory Service) is a robust E-commerce platform built using **Node.js**, **NestJS**, **Docker**, **RabbitMQ**, **Mongoose**, and **MongoDB**. It provides a RESTful API for managing inventory, allowing users to easily create, update, and delete items, retrieve inventory details with pagination, and check stock availability. The platform features event-based communication by utilizing RabbitMQ, a message broker, allowing inventory updates to trigger notifications to other services (order-service). It integrates Cloudinary for image uploads during inventory creation. Swagger is integrated for easy API testing and documentation access. You can view the Swagger documentation by adding `/documentationView` to the base URL.

## Features
- **Inventory Management**: Create, update, and retrieve inventory items with pagination.
- **Stock Availability**: Check real-time stock levels for each item.
- **Cloudinary Integration**: Upload images during inventory creation to enhance item listings.

## Table of Contents
Installation<br />
Environment Variables<br />
Project Structure<br />
API Routes<br />
Technologies Used<br />


## Installation
To install and run the project locally:

#### Clone the repository:

``` 
git clone https://github.com/EddieBenn/Inventory-Service.git
```
#### Navigate into the project directory:

```
cd Inventory-Service
```

#### Install dependencies:

```
npm install
```

#### Create a .env file in the root directory and add the necessary environment variables (see the Environment Variables section).


#### Build the project

```
npm run build
```

#### Running the app

```
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### Test

```
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Environment Variables
Create a .env file in the root directory with the following variables:

```
# DEVELOPMENT KEYS
PORT = YOUR PORT
MONGO_URI = YOUR MONGO_URI
RABBITMQ_URI = YOUR RABBITMQ_URI

# CLOUDINARY KEYS
CLOUDINARY_NAME = YOUR CLOUDINARY_NAME
API_KEY = YOUR API_KEY
API_SECRET = YOUR API_SECRET

```


# Project Structure

```
├── src
│   ├── common
│   ├── inventory
│   ├── utils
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest.e2e.json
├── .dockerignore
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── tsconfig.build.json
```


## API Routes
#### Inventory Routes


<table>
  <thead>
    <tr>
      <th>HTTP Method</th>
      <th>Endpoint</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/inventory</td>
      <td>Create inventory</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/check-stock/:id</td>
      <td>Check stock availability</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/deduct-stock/:id</td>
      <td>Deduct stock from inventory</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/</td>
      <td>Get all inventories</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/:id</td>
      <td>Get one inventory</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/:id</td>
      <td>Update inventory</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/:id</td>
      <td>Delete inventory</td>
    </tr>
  </tbody>
</table>


## Technologies Used

<ul>
<li>
Node.js
</li>
<li>
NestJS
</li>
<li>
TypeScript
</li>
<li>
Docker
</li>
<li>
RabbitMQ (for event-based communication)
</li>
<li>
Cloudinary (for image uploads)
</li>
<li>
Multer (for file uploads)
</li>
<li>
Mongoose (for ODM)
</li>
<li>
MongoDB
</li>
<li>
Jest (for unit testing)
</li>
<li>
Swagger (for API documentation and testing)
</li>
<li>
Class-validator & Class-transformer (for input validation)
</li>
</ul>
