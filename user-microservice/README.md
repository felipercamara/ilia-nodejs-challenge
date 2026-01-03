# User Microservice

This is the User Microservice for the ília Digital Code Challenge (Part 2). It handles user authentication, registration, and management with JWT token-based security.

## 🚀 Features

- User registration and authentication
- JWT token-based authentication
- RESTful API
- PostgreSQL database with TypeORM
- Docker containerized application
- Lightweight PostgreSQL (Alpine-based) for fast builds
- Health checks and monitoring
- Input validation with class-validator

## 📋 Prerequisites

Before running this microservice, ensure you have:

- Docker and Docker Compose installed
- Node.js v18 or higher (for local development)
- npm or yarn package manager

## 🏗️ Architecture

- **Framework**: NestJS
- **Database**: PostgreSQL 15 (Alpine)
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator
- **Port**: 3002

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Node Environment
NODE_ENV=development

# Database Configuration (for user-microservice)
DB_HOST=user-postgres
DB_PORT=5432
DB_NAME=user_db
DB_USER=user_admin
DB_PASSWORD=user_secure_pass

# User Database (for Docker Compose)
USER_DB_USER=user_admin
USER_DB_PASSWORD=user_secure_pass

# JWT Configuration
JWT_SECRET=ILIACHALLENGE
JWT_EXPIRES_IN=24h

# Service Configuration
PORT=3002
```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

1. Navigate to the root directory of the project:

```bash
cd /home/felipe/ilia-nodejs-challenge
```

2. Make sure you have the `.env` file configured with the environment variables

3. Build and start the services:

```bash
docker-compose up -d user-postgres user-microservice
```

4. Check the services status:

```bash
docker-compose ps
```

5. View logs:

```bash
docker-compose logs -f user-microservice
```

6. Stop the services:

```bash
docker-compose down
```

### Building Manually

If you want to build and run only this microservice:

```bash
# Build the Docker image
docker build -t user-microservice ./user-microservice

# Run the container
docker run -p 3002:3002 \
  -e NODE_ENV=development \
  -e DB_HOST=user-postgres \
  -e DB_PORT=5432 \
  -e DB_NAME=user_db \
  -e DB_USER=user_admin \
  -e DB_PASSWORD=user_secure_pass \
  -e JWT_SECRET=ILIACHALLENGE \
  -e JWT_EXPIRES_IN=24h \
  -e PORT=3002 \
  user-microservice
```

## 💻 Local Development

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

### Database Migrations

```bash
# Run migrations
npm run migration:run

# Generate a new migration
npm run migration:generate -- -n MigrationName

# Create an empty migration
npm run migration:create -- -n MigrationName

# Revert last migration
npm run migration:revert
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📡 API Endpoints

### Health Check

- `GET /` - Service health check

### Authentication

- `POST /auth` - Authenticate user and get JWT token (public)

### Users

- `POST /users` - Register a new user (public)
- `GET /users` - Get all users (requires JWT)
- `GET /users/:id` - Get user by ID (requires JWT)
- `PATCH /users/:id` - Update user (requires JWT)
- `DELETE /users/:id` - Delete user (requires JWT)

### Authorization

All protected routes require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

## 🔐 Security

- JWT Secret Key: `ILIACHALLENGE` (configurable via environment variable)
- All routes are protected with JWT authentication
- Password hashing with bcrypt
- Input validation on all endpoints
- CORS enabled for cross-origin requests

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ Resource Limits

The microservice runs with the following resource constraints:

- **CPU**: 0.5 cores (limit), 0.25 cores (reservation)
- **Memory**: 256MB (limit), 128MB (reservation)

These limits ensure fast startup and efficient resource utilization.

## 🔍 Health Checks

The PostgreSQL database includes health checks that verify the service is ready before the application starts:

- Check interval: 10 seconds
- Timeout: 5 seconds
- Retries: 5

## 📝 Project Structure

```
user-microservice/
├── src/
│   ├── entities/          # Database entities
│   ├── users/            # User module
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── app.module.ts     # Main application module
│   └── main.ts           # Application entry point
├── test/                 # Test files
├── Dockerfile           # Docker configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🐛 Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify the database container is running:

```bash
docker ps | grep user-postgres
```

2. Check database logs:

```bash
docker-compose logs user-postgres
```

3. Verify environment variables are correctly set

### Port Already in Use

If port 3002 is already in use:

```bash
# Find the process using the port
lsof -i :3002

# Kill the process or change the PORT in .env file
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
