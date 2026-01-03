# ília Node.js Challenge

## Quick Start

### Prerequisites

- Docker and Docker Compose
- cURL or Postman

### Start Services

```bash
docker compose up -d
```

Check services are healthy:

```bash
docker compose ps
```

## Test the API

**Note:** All routes require JWT authentication, including user creation. For initial testing, generate a JWT token manually.

### 0. Generate Initial JWT Token (Bootstrap)

Since all routes require authentication, generate a JWT token manually using the `JWT_SECRET` (`ILIACHALLENGE`):

```bash
# Using Node.js
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: 'bootstrap', email: 'test@example.com' }, 'ILIACHALLENGE', { expiresIn: '24h' });
console.log(token);
"
```

Or use [jwt.io](https://jwt.io) with:

- **Algorithm**: HS256
- **Secret**: `ILIACHALLENGE`
- **Payload**: `{"userId": "bootstrap", "email": "test@example.com", "iat": 1234567890, "exp": 9999999999}`

Copy the generated token for use in the examples below.

### 1. Create User

```bash
curl -X POST http://localhost:3002/users \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "João",
    "last_name": "Silva",
    "email": "joao@example.com",
    "password": "mudar@123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3002/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "mudar@123"
  }'
```

Copy the `access_token` from response for subsequent requests.

### 3. Create Transaction (CREDIT)

```bash
curl -X POST http://localhost:3001/transactions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "<USER_ID>",
    "amount": 100.50,
    "type": "CREDIT"
  }'
```

### 4. Create Transaction (DEBIT)

```bash
curl -X POST http://localhost:3001/transactions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "<USER_ID>",
    "amount": 50.00,
    "type": "DEBIT"
  }'
```

### 5. List All Transactions

```bash
curl -X GET http://localhost:3001/transactions \
  -H "Authorization: Bearer <TOKEN>"
```

### 6. List Transactions by Type (CREDIT)

```bash
curl -X GET "http://localhost:3001/transactions?type=CREDIT" \
  -H "Authorization: Bearer <TOKEN>"
```

### 7. List Transactions by Type (DEBIT)

```bash
curl -X GET "http://localhost:3001/transactions?type=DEBIT" \
  -H "Authorization: Bearer <TOKEN>"
```

### 8. Get Balance

```bash
curl -X GET http://localhost:3001/balance \
  -H "Authorization: Bearer <TOKEN>"
```

## API Endpoints

### User Microservice (Port 3002)

| Endpoint     | Method | Auth | Description |
| ------------ | ------ | ---- | ----------- |
| `/auth`      | POST   | No   | Login       |
| `/users`     | POST   | Yes  | Create user |
| `/users`     | GET    | Yes  | List users  |
| `/users/:id` | GET    | Yes  | Get user    |
| `/users/:id` | PATCH  | Yes  | Update user |
| `/users/:id` | DELETE | Yes  | Delete user |

### Wallet Microservice (Port 3001)

| Endpoint                    | Method | Auth | Description        |
| --------------------------- | ------ | ---- | ------------------ |
| `/transactions`             | POST   | Yes  | Create transaction |
| `/transactions`             | GET    | Yes  | List transactions  |
| `/transactions?type=CREDIT` | GET    | Yes  | Filter by type     |
| `/balance`                  | GET    | Yes  | Get balance        |

## Configuration

Services use environment variables from `.env` file:

- **JWT_SECRET**: `ILIACHALLENGE`
- **JWT_INTERNAL_SECRET**: `ILIACHALLENGE_INTERNAL`
- **JWT_EXPIRES_IN**: `24h`
- **User Service**: Port 3002
- **Wallet Service**: Port 3001

## Troubleshooting

Restart services:

```bash
docker compose down
docker compose up -d --build
```

View logs:

```bash
docker compose logs -f
```

Reset databases:

```bash
docker compose down -v
docker compose up -d --build
```

---
