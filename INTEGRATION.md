# Microservices Integration Guide

This document describes the integration between the User Microservice and Wallet Microservice for the ília Code Challenge.

## Architecture Overview

The system consists of two microservices that communicate via REST HTTP:

1. **User Microservice** (Port 3002) - Handles user authentication and management
2. **Wallet Microservice** (Port 3001) - Handles financial transactions and wallet balance

```
┌─────────────────┐
│     Client      │
└────────┬────────┘
         │
         │ HTTP/JWT
         │
    ┌────┴─────────────────────────────────┐
    │                                      │
    v                                      v
┌─────────────────┐              ┌──────────────────┐
│     User        │◄─────────────┤     Wallet       │
│  Microservice   │   Validates  │  Microservice    │
│   (Port 3002)   │     User     │   (Port 3001)    │
└────────┬────────┘              └────────┬─────────┘
         │                                │
         v                                v
┌─────────────────┐              ┌──────────────────┐
│   PostgreSQL    │              │   PostgreSQL     │
│   (user_db)     │              │   (wallet_db)    │
└─────────────────┘              └──────────────────┘
```

## Communication Strategy

### Type: REST HTTP Communication

The microservices communicate using REST HTTP calls with JWT authentication.

### Security

- **External Communication**: Uses JWT with secret `ILIACHALLENGE` (as required)
- **Internal Communication**: Uses the same JWT token passed from the client
- Token validation ensures user exists before creating transactions

## Integration Flow

### 1. User Registration Flow

```
Client -> User Microservice: POST /users
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "secure123"
  }

User Microservice -> Client: 200 OK
  {
    "id": "uuid-123",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  }
```

### 2. Authentication Flow

```
Client -> User Microservice: POST /auth
  {
    "email": "john@example.com",
    "password": "secure123"
  }

User Microservice -> Client: 200 OK
  {
    "user": { ... },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
```

### 3. Transaction Creation with User Validation

```
Client -> Wallet Microservice: POST /transactions
  Authorization: Bearer <jwt_token>
  {
    "user_id": "uuid-123",
    "amount": 100.50,
    "type": "CREDIT"
  }

Wallet Microservice -> User Microservice: GET /users/uuid-123
  Authorization: Bearer <jwt_token>

User Microservice -> Wallet Microservice: 200 OK
  {
    "id": "uuid-123",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  }

Wallet Microservice validates user exists
Wallet Microservice -> Database: INSERT transaction

Wallet Microservice -> Client: 201 Created
  {
    "id": "tx-uuid",
    "user_id": "uuid-123",
    "amount": 100.50,
    "type": "CREDIT"
  }
```

## Environment Configuration

### User Microservice (.env)

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=user_db
DB_USER=user_user
DB_PASSWORD=user_pass
JWT_SECRET=ILIACHALLENGE
JWT_INTERNAL_SECRET=ILIACHALLENGE_INTERNAL
WALLET_SERVICE_URL=http://localhost:3001
```

### Wallet Microservice (.env)

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wallet_db
DB_USER=wallet_user
DB_PASSWORD=wallet_pass
JWT_SECRET=ILIACHALLENGE
JWT_INTERNAL_SECRET=ILIACHALLENGE_INTERNAL
USER_SERVICE_URL=http://localhost:3002
```

## Running Both Microservices

### Option 1: Using Docker Compose (Recommended)

```bash
# Start both microservices with their databases
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Running Locally

Terminal 1 - User Microservice:

```bash
cd user-microservice
npm install
npm run start:dev
```

Terminal 2 - Wallet Microservice:

```bash
cd wallet-microservice
npm install
npm run start:dev
```

## Testing the Integration

### 1. Create a User

```bash
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "secure123"
  }'
```

### 2. Login to Get JWT Token

```bash
curl -X POST http://localhost:3002/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }'
```

Save the `access_token` from the response.

### 3. Create a Transaction (with User Validation)

```bash
curl -X POST http://localhost:3001/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "user_id": "<user_id_from_step_1>",
    "amount": 100.50,
    "type": "CREDIT"
  }'
```

The Wallet Microservice will automatically validate the user exists in the User Microservice before creating the transaction.

### 4. Check Balance

```bash
curl -X GET http://localhost:3001/balance \
  -H "Authorization: Bearer <your_access_token>"
```

## Integration Points

### UserHttpService (Wallet Microservice)

Located at: `wallet-microservice/src/users-http/user-http.service.ts`

This service is responsible for:

- Making HTTP calls to User Microservice
- Validating users before transaction creation
- Handling errors and timeouts
- Passing JWT tokens for authentication

### Key Methods:

```typescript
// Validate if user exists
async validateUser(userId: string, authToken: string): Promise<UserValidationResponse>

// Get user details
async getUserById(userId: string, authToken: string): Promise<UserValidationResponse>
```

## Error Handling

### User Not Found

If the wallet microservice tries to create a transaction for a non-existent user:

```json
{
  "statusCode": 400,
  "message": "User validation failed. User does not exist or is invalid.",
  "error": "Bad Request"
}
```

### Invalid JWT Token

If JWT token is invalid or expired:

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Service Communication Error

If User Microservice is unavailable:

```json
{
  "statusCode": 401,
  "message": "Failed to validate user with User Microservice",
  "error": "Unauthorized"
}
```

## Benefits of This Integration

1. **User Validation**: Ensures only valid users can create transactions
2. **Separation of Concerns**: Each microservice handles its own domain
3. **Scalability**: Services can be scaled independently
4. **Maintainability**: Clear boundaries between user management and wallet operations
5. **Security**: JWT authentication across all service boundaries

## Future Enhancements

- Implement circuit breaker pattern for resilience
- Add caching layer to reduce inter-service calls
- Implement event-driven communication using message queues (Kafka, RabbitMQ)
- Add distributed tracing (OpenTelemetry, Jaeger)
- Implement API Gateway for unified client interface
- Add rate limiting and throttling
- Implement service discovery (Consul, Eureka)

## Technologies Used

- **NestJS**: Modern Node.js framework for building microservices
- **TypeScript**: Type-safe development
- **JWT**: Authentication and authorization
- **Axios/HttpModule**: HTTP client for inter-service communication
- **Docker**: Containerization
- **PostgreSQL**: Relational database for both services

## Compliance with Challenge Requirements

✅ **Part 1 - Wallet Microservice**

- Running on port 3001
- JWT authentication with ILIACHALLENGE secret
- PostgreSQL database
- Docker containerization
- HTTP REST endpoints

✅ **Part 2 - User Microservice & Integration**

- Running on port 3002
- JWT authentication with ILIACHALLENGE secret
- PostgreSQL database (separate from wallet)
- Docker containerization
- HTTP REST endpoints
- **REST communication** between microservices
- Internal communication security (JWT token propagation)
- User validation integration with Wallet Microservice

## Support

For issues or questions, please refer to the individual microservice README files:

- [User Microservice README](./user-microservice/README.md)
- [Wallet Microservice README](./wallet-microservice/README.md)
