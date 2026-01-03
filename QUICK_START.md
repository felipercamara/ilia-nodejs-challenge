# Quick Start Guide - ília Code Challenge

## 🚀 Quick Start (5 minutes)

### Prerequisites

- Docker and Docker Compose installed
- Git
- cURL or Postman

### 1. Start Services (30 seconds)

```bash
docker compose up -d
```

### 2. Wait for Services to Start (10 seconds)

```bash
# Check if services are healthy
docker compose ps
```

Both `user-microservice` and `wallet-microservice` should show "Up" status.

### 3. Test the Integration (3 minutes)

#### Step 1: Create a User

```bash
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "João",
    "last_name": "Silva",
    "email": "joao@example.com",
    "password": "mudar@123"
  }'
```

**Copy the `id` from the response!**

#### Step 2: Login

```bash
curl -X POST http://localhost:3002/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "mudar@123"
  }'
```

**Copy the `access_token` from the response!**

#### Step 3: Create Transaction (Integration Test!)

```bash
# Replace <TOKEN> and <USER_ID> with values from above
curl -X POST http://localhost:3001/transactions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "<USER_ID>",
    "amount": 100.50,
    "type": "CREDIT"
  }'
```

✅ **If you see a transaction created, the integration is working!**

The Wallet Microservice just validated your user with the User Microservice! 🎉

#### Step 4: Check Balance

```bash
curl -X GET http://localhost:3001/balance \
  -H "Authorization: Bearer <TOKEN>"
```

Expected: `{"amount": 100.50}`

## 📚 Service Endpoints

### User Microservice (Port 3002)

| Method | Endpoint     | Auth Required | Description |
| ------ | ------------ | ------------- | ----------- |
| POST   | `/users`     | No            | Create user |
| POST   | `/auth`      | No            | Login       |
| GET    | `/users`     | Yes           | List users  |
| GET    | `/users/:id` | Yes           | Get user    |
| PATCH  | `/users/:id` | Yes           | Update user |
| DELETE | `/users/:id` | Yes           | Delete user |

### Wallet Microservice (Port 3001)

| Method | Endpoint                    | Auth Required | Description                          |
| ------ | --------------------------- | ------------- | ------------------------------------ |
| POST   | `/transactions`             | Yes           | Create transaction (validates user!) |
| GET    | `/transactions`             | Yes           | List transactions                    |
| GET    | `/transactions?type=CREDIT` | Yes           | Filter by type                       |
| GET    | `/balance`                  | Yes           | Get balance                          |

## 🔑 Important Values

- **JWT Secret**: `ILIACHALLENGE` (as required by challenge)
- **JWT Internal**: `ILIACHALLENGE_INTERNAL` (for inter-service communication)
- **Token Expiry**: 24 hours
- **User Microservice**: http://localhost:3002
- **Wallet Microservice**: http://localhost:3001

## 🐛 Troubleshooting

### Services not starting?

```bash
docker compose down
docker compose up -d --build
```

### Can't connect to database?

```bash
# Check database health
docker compose ps
# Both postgres containers should show "(healthy)"
```

### Need to see logs?

```bash
# User microservice
docker compose logs user-microservice -f

# Wallet microservice
docker compose logs wallet-microservice -f

# All services
docker compose logs -f
```

### Reset everything?

```bash
docker compose down -v  # Removes volumes (databases)
docker compose up -d --build
```

## 📖 Full Documentation

- [Integration Guide](./INTEGRATION.md) - Detailed architecture and integration
- [API Testing Guide](./API_TESTING.md) - Complete API examples
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - What was built
- [User Microservice README](./user-microservice/README.md) - Service details
- [Main README](./README.md) - Challenge requirements

## ✅ Quick Validation Checklist

- [ ] Both Docker containers are running (`docker compose ps`)
- [ ] User creation works (POST /users)
- [ ] Login works and returns JWT token (POST /auth)
- [ ] Transaction creation works (POST /transactions)
- [ ] Balance calculation works (GET /balance)
- [ ] Protected endpoints require authentication
- [ ] Wallet MS validates users with User MS (the integration!)

## 🎯 Key Features Implemented

✅ **Part 1 - Wallet Microservice**

- Port 3001
- JWT authentication (ILIACHALLENGE)
- PostgreSQL database
- Transaction CRUD
- Balance calculation

✅ **Part 2 - User Microservice**

- Port 3002
- JWT authentication (ILIACHALLENGE)
- Separate PostgreSQL database
- User CRUD + Authentication
- **REST integration with Wallet MS** ⭐

✅ **Integration**

- REST HTTP communication
- User validation before transactions
- JWT token propagation
- Error handling
- Docker orchestration

## 💡 Pro Tips

1. **Save your JWT token** - It's valid for 24 hours
2. **Use environment variables** - All configs in .env files
3. **Check logs first** - Most issues show up in logs
4. **Use jq** - Format JSON: `curl ... | jq`
5. **Test incrementally** - User → Auth → Transaction → Balance

## 🚨 Common Issues

**401 Unauthorized**: Your JWT token expired or is invalid. Login again.

**404 Not Found**: Check the URL and port (3001 vs 3002)

**400 Bad Request - User validation failed**: The user_id doesn't exist. Create the user first.

**Connection refused**: Services not running. Run `docker compose up -d`

## 📞 Support

For detailed information, check the documentation files:

- Architecture: [INTEGRATION.md](./INTEGRATION.md)
- Testing: [API_TESTING.md](./API_TESTING.md)
- Implementation: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

**Happy coding!** 🤓

Challenge completed with ❤️ for ília Digital
