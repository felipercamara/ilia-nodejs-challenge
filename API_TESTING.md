# Testing Guide - API Examples

This guide provides example API requests for testing both microservices and their integration.

## Prerequisites

- Both microservices running (User on :3002, Wallet on :3001)
- cURL or any HTTP client (Postman, Insomnia, etc.)

## 1. User Microservice Tests

### Create a New User (Public Endpoint)

```bash
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Alice",
    "last_name": "Johnson",
    "email": "alice@example.com",
    "password": "securePassword123"
  }'
```

**Expected Response** (200 OK):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Alice",
  "last_name": "Johnson",
  "email": "alice@example.com",
  "created_at": "2026-01-03T10:30:00.000Z",
  "updated_at": "2026-01-03T10:30:00.000Z"
}
```

### Login / Authentication

```bash
curl -X POST http://localhost:3002/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securePassword123"
  }'
```

**Expected Response** (200 OK):

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "Alice",
    "last_name": "Johnson",
    "email": "alice@example.com",
    "created_at": "2026-01-03T10:30:00.000Z",
    "updated_at": "2026-01-03T10:30:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImFsaWNlQGV4YW1wbGUuY29tIiwiaWF0IjoxNzM1OTAxNDAwLCJleHAiOjE3MzU5ODc4MDB9.xxxxxxxxxxxxx"
}
```

**Save the `access_token` and `user.id` for subsequent requests!**

### Get All Users (Protected)

```bash
export TOKEN="<access_token_from_login>"

curl -X GET http://localhost:3002/users \
  -H "Authorization: Bearer $TOKEN"
```

### Get User by ID (Protected)

```bash
export USER_ID="550e8400-e29b-41d4-a716-446655440000"
export TOKEN="<access_token_from_login>"

curl -X GET http://localhost:3002/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Update User (Protected)

```bash
export USER_ID="550e8400-e29b-41d4-a716-446655440000"
export TOKEN="<access_token_from_login>"

curl -X PATCH http://localhost:3002/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Alicia",
    "last_name": "Smith"
  }'
```

### Delete User (Protected)

```bash
export USER_ID="550e8400-e29b-41d4-a716-446655440000"
export TOKEN="<access_token_from_login>"

curl -X DELETE http://localhost:3002/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

## 2. Wallet Microservice Tests

### Create Transaction - CREDIT (Protected, with User Validation)

This demonstrates the integration: Wallet Microservice validates the user exists in User Microservice before creating the transaction.

```bash
export USER_ID="550e8400-e29b-41d4-a716-446655440000"
export TOKEN="<access_token_from_login>"

curl -X POST http://localhost:3001/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "amount": 150.75,
    "type": "CREDIT"
  }'
```

**Expected Response** (201 Created):

```json
{
  "id": "tx-uuid-123",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 150.75,
  "type": "CREDIT"
}
```

**Behind the scenes:**

1. Client sends request to Wallet Microservice
2. Wallet Microservice calls User Microservice: `GET /users/{user_id}`
3. User Microservice validates JWT and returns user data
4. Wallet Microservice creates the transaction
5. Response sent to client

### Create Transaction - DEBIT

```bash
export USER_ID="550e8400-e29b-41d4-a716-446655440000"
export TOKEN="<access_token_from_login>"

curl -X POST http://localhost:3001/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "amount": 50.25,
    "type": "DEBIT"
  }'
```

### Get All Transactions

```bash
export TOKEN="<access_token_from_login>"

curl -X GET http://localhost:3001/transactions \
  -H "Authorization: Bearer $TOKEN"
```

### Get Transactions by Type

```bash
export TOKEN="<access_token_from_login>"

# Get only CREDIT transactions
curl -X GET "http://localhost:3001/transactions?type=CREDIT" \
  -H "Authorization: Bearer $TOKEN"

# Get only DEBIT transactions
curl -X GET "http://localhost:3001/transactions?type=DEBIT" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Balance (Protected)

```bash
export TOKEN="<access_token_from_login>"

curl -X GET http://localhost:3001/balance \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response**:

```json
{
  "balance": 100.5
}
```

Calculation: CREDIT (150.75) - DEBIT (50.25) = 100.50

## 3. Testing Integration Scenarios

### Scenario 1: Invalid User ID

Try to create a transaction with a non-existent user_id:

```bash
export TOKEN="<access_token_from_login>"

curl -X POST http://localhost:3001/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "00000000-0000-0000-0000-000000000000",
    "amount": 100,
    "type": "CREDIT"
  }'
```

**Expected Response** (400 Bad Request):

```json
{
  "statusCode": 400,
  "message": "User validation failed. User does not exist or is invalid.",
  "error": "Bad Request"
}
```

### Scenario 2: Missing Authentication

Try to access protected endpoints without token:

```bash
curl -X GET http://localhost:3002/users
```

**Expected Response** (401 Unauthorized):

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Scenario 3: Invalid or Expired Token

```bash
curl -X GET http://localhost:3002/users \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Response** (401 Unauthorized):

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## 4. Complete Workflow Example

Here's a complete workflow from user registration to checking balance:

```bash
# 1. Create user
USER_RESPONSE=$(curl -s -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Bob",
    "last_name": "Builder",
    "email": "bob@example.com",
    "password": "build123"
  }')

echo "User created: $USER_RESPONSE"
USER_ID=$(echo $USER_RESPONSE | jq -r '.id')

# 2. Login
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3002/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "password": "build123"
  }')

echo "Login successful: $AUTH_RESPONSE"
TOKEN=$(echo $AUTH_RESPONSE | jq -r '.access_token')

# 3. Create CREDIT transaction
curl -s -X POST http://localhost:3001/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "amount": 500,
    "type": "CREDIT"
  }' | jq

# 4. Create DEBIT transaction
curl -s -X POST http://localhost:3001/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "amount": 150,
    "type": "DEBIT"
  }' | jq

# 5. Check balance
curl -s -X GET http://localhost:3001/balance \
  -H "Authorization: Bearer $TOKEN" | jq

# Expected balance: 350 (500 - 150)
```

## 5. Postman Collection

You can import the following JSON into Postman for easier testing:

```json
{
  "info": {
    "name": "Ilia Challenge - Microservices",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "user_base_url",
      "value": "http://localhost:3002"
    },
    {
      "key": "wallet_base_url",
      "value": "http://localhost:3001"
    },
    {
      "key": "token",
      "value": ""
    },
    {
      "key": "user_id",
      "value": ""
    }
  ]
}
```

## Tips

1. **Save Your Token**: After login, save the access_token in an environment variable
2. **Save User ID**: Keep the user ID from registration for transaction creation
3. **Check Logs**: Monitor microservice logs for integration debugging
4. **Use jq**: Install `jq` for better JSON formatting in terminal
5. **Test Order**: Always test user creation → login → protected endpoints

## Troubleshooting

### "User validation failed"

- Ensure the user_id in the transaction matches an existing user
- Verify the user exists: `GET /users/:id`

### "Unauthorized" on protected endpoints

- Check if JWT token is valid and not expired
- Re-login to get a fresh token

### "Connection refused"

- Verify both microservices are running
- Check ports 3001 and 3002 are not in use by other applications
- Review Docker containers status: `docker-compose ps`

### Database errors

- Check database connections in .env files
- Verify PostgreSQL is running
- Check database credentials

## Additional Resources

- [Main README](./README.md)
- [Integration Guide](./INTEGRATION.md)
- [User Microservice README](./user-microservice/README.md)
- [Wallet Microservice README](./wallet-microservice/README.md)
- [OpenAPI Spec - Users](./ms-users.yaml)
- [OpenAPI Spec - Wallet](./ms-transactions.yaml)
