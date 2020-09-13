# goBarber Back-end

goBarber is an application where barbers can offer their services to the public and clients can schedule appoints with their favorite barbers.

This repository contains the application's back-end and was developed during the Rocketseat's MERN stack Bootcamp.

# Technologies and Learning Outcomes

The back-end was developed with **NodeJS**, **Express**, and **Typescript**. It allowed me to have hands on experience with:

- RESTful APIs
- Routing
- Models
- Repositories
- Services
- Working with multiple databases (TypeORM)
  - PostgreSQL
  - MongoDB
  - Redis (for caching)
- Docker
- Authentication via JWT
- File Uploads and Storage
  - AWS S3
  - Local Storage
- Domain Driven Design (DDD)
- Dependency Injection with Tsyringe
- Email Services
- Debugging
- Testing with Jest
- Deployment
- CI/CD

# Installation

To run the application you will need:

- [Git](https://git-scm.com)
- [Node](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

After cloning the repository, navigate to the project's folder and run

```
yarn
```

This will download and install all dependencies required to run the application.
Next, you will need to create three docker containers that are responsible for hosting PostgreSQL, MongoDB and Redis.

- PostgreSQL
  ```
  docker run --name gostack_postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
  ```
- MongoDB
  ```
  docker run --name mongodb -p 27017:27017 -d -t mongo
  ```
- Redis
  ```
  docker run --name redis -p 6379:6379 -d -t redis:alpine
  ```

Next, you will need to rename the file .env.example to .env

With the containers running we are ready to start the server. At the root folder of the project run:

```
yarn dev:server
```

# Repositories

Below are the links to the other parts of the application

[Back-end] https://github.com/feernandobraga/goBarber-back-end

[Front-end] http://

[Mobile] http://
