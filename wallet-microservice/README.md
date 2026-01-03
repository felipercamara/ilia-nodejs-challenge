# Wallet Microservice

Digital Wallet microservice for managing user transactions (CREDIT and DEBIT operations).

## 🚀 Features

- RESTful API for transaction management
- JWT Authentication (Bearer Token)
- PostgreSQL database with TypeORM
- Docker containerization
- Comprehensive test coverage
- User validation through User Microservice integration
- Insufficient funds validation for DEBIT transactions
- Balance calculation (CREDIT - DEBIT)
- Global validation pipes
- Query-based transaction filtering

## 📋 Prerequisites

- Node.js 18+ (LTS)
- Docker and Docker Compose
- npm or yarn

## 🔧 Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
# Database Configuration
DB_USER='wallet_user'
DB_PASSWORD='wallet_pass'
DB_NAME='wallet_db'
DB_HOST='localhost'
DB_PORT=5432
NODE_ENV='development'

# JWT Configuration
JWT_SECRET='ILIACHALLENGE'
JWT_EXPIRES_IN='24h'
PORT=3001

# User Microservice Integration
USER_SERVICE_URL='http://user-microservice:3002'
```

## 🐳 Running with Docker

### Start all services (Database + Application)

```bash
# From the project root directory
docker-compose up -d

# Check logs
docker-compose logs -f wallet-microservice
```

The application will be available at `http://localhost:3001`

### Stop services

```bash
docker-compose down
```

## 💻 Local Development

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run start:dev
```

### Run in production mode

```bash
npm run build
npm run start:prod
```

## 🧪 Testing

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

## 🔒 Authentication

All API endpoints require JWT authentication using Bearer Token.

### Token Format

```
Authorization: Bearer <your-jwt-token>
```

### JWT Payload Example

```json
{
  "sub": "user-id",
  "username": "username",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Generating JWT Tokens for Testing

You can obtain JWT tokens from the User Microservice (POST /auth), or generate test tokens using one of these methods:

**Method 1: Node.js Command (Recommended)**

```bash
node -p "require('jsonwebtoken').sign({ sub: 'user-123', username: 'testuser' }, 'ILIACHALLENGE', { expiresIn: '24h' })"
```

**Method 2: Using jwt.io**

1. Visit [https://jwt.io](https://jwt.io)
2. Select algorithm **HS256**
3. In the **PAYLOAD** section, paste:
   ```json
   {
     "sub": "user-123",
     "username": "testuser"
   }
   ```
4. In the **VERIFY SIGNATURE** section, replace the secret with: `ILIACHALLENGE`
5. Copy the token from the **Encoded** section

**Method 3: Using curl with generated token**

```bash
# Generate and store token
TOKEN=$(node -p "require('jsonwebtoken').sign({ sub: 'user-123', username: 'testuser' }, 'ILIACHALLENGE', { expiresIn: '24h' })")

# Use the token in requests
curl -X GET http://localhost:3001/transactions \
  -H "Authorization: Bearer $TOKEN"
```

## 📡 API Endpoints

All endpoints require JWT authentication.

### Create Transaction

```http
POST /transactions
Content-Type: application/json
Authorization: Bearer <token>

{
  "user_id": "user-uuid",
  "type": "CREDIT",
  "amount": 100
}
```

**Returns:** `201 Created`

**Validations:**

- Validates user exists in User Microservice
- For DEBIT transactions: checks for sufficient funds
- Amount must be >= 0
- user_id must be valid UUID
- type must be CREDIT or DEBIT

### Get Transactions

```http
GET /transactions?type=CREDIT
Authorization: Bearer <token>
```

Query Parameters:

- `type` (optional): Filter by transaction type (CREDIT or DEBIT)

**Returns:** Array of transactions for the authenticated user

### Get Balance

```http
GET /balance
Authorization: Bearer <token>
```

**Returns:** `{ "amount": number }`

Calculates consolidated balance for authenticated user: SUM(CREDIT) - SUM(DEBIT)

## 🏗️ Project Structure

```
wallet-microservice/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── guards/             # JWT Auth Guard
│   │   ├── strategies/         # JWT Strategy
│   │   └── auth.module.ts
│   ├── entities/               # Database entities
│   │   └── transactions.entity.ts
│   ├── transactions/           # Transactions module
│   │   ├── dto/               # Data Transfer Objects
│   │   │   ├── create-transaction.dto.ts
│   │   │   ├── query-transaction.dto.ts
│   │   │   ├── transaction-response.dto.ts
│   │   │   └── balance-response.dto.ts
│   │   ├── enums/             # Transaction types enum
│   │   ├── filters/           # Exception filters
│   │   ├── interceptors/      # Logging interceptor
│   │   ├── interfaces/        # TypeScript interfaces
│   │   ├── test/              # Unit tests
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── transactions.module.ts
│   ├── users-http/            # User Microservice HTTP client
│   │   ├── user-http.service.ts
│   │   └── user-http.module.ts
│   ├── utils/                 # Utilities and constants
│   │   └── constants.ts
│   ├── app.module.ts
│   └── main.ts
├── coverage/                   # Test coverage reports
├── test/                       # E2E tests
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## 🛠️ Technologies

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (Passport)
- **Validation:** class-validator, class-transformer
- **Testing:** Jest
- **Container:** Docker

## 📝 Development Guidelines

### Code Style

```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Database Migrations

```bash
# Generate migration
npm run migration:generate

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🔐 Security Notes

- JWT secret key must be provided via `JWT_SECRET` environment variable
- For production, use strong, randomly generated secrets
- Default secret `ILIACHALLENGE` is for development/challenge purposes only
- All routes are protected by JWT authentication
- User validation through User Microservice integration
- Insufficient funds validation prevents negative balances
- Whitelist validation (strips unknown properties)
- Transform validation enabled
