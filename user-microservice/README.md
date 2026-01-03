# User Microservice

This is the User Microservice for the ília Digital Code Challenge (Part 2). It handles user authentication, registration, and management with JWT token-based security.

## 🚀 Features

- User creation and management
- JWT token-based authentication
- RESTful API
- PostgreSQL database with TypeORM
- Docker containerized application
- Lightweight PostgreSQL (Alpine-based) for fast builds
- Health checks and monitoring
- Input validation with class-validator
- Password hashing with bcrypt
- Email uniqueness validation
- Global validation pipes

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

1. Navigate to the root directory of the project

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

- `POST /auth` - Authenticate user and get JWT token
  - Request body: `{ "email": "string", "password": "string" }`
  - Response: `{ "user": { "id", "email", "first_name", "last_name", "created_at", "updated_at" }, "access_token": "string" }`

### Users

- `POST /users` - Create a new user (requires JWT)
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
- Most routes are protected with JWT authentication (except POST /auth)
- Password hashing with bcrypt (salt rounds: 10)
- Password minimum length: 6 characters
- Input validation on all endpoints with class-validator
- Email uniqueness validation
- Whitelist validation (strips unknown properties)
- Transform validation enabled

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
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
│   │   └── users.entity.ts
│   ├── auth/             # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── users/            # User module
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/         # Data transfer objects
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   ├── user-response.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   └── test/        # Unit tests
│   ├── app.module.ts     # Main application module
│   └── main.ts           # Application entry point
├── coverage/            # Test coverage reports
├── Dockerfile           # Docker configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```
