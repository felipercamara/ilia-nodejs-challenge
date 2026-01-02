# Transactions Module - Implementation Guide

## Overview

This module implements the transactions functionality as specified in `ms-transactions.yaml`. It follows NestJS best practices with clean code architecture.

## Structure

```
transactions/
├── dto/                          # Data Transfer Objects
│   ├── create-transaction.dto.ts # Request DTO for creating transactions
│   ├── transaction-response.dto.ts # Response DTO for transactions
│   ├── query-transaction.dto.ts  # Query parameters DTO
│   ├── balance-response.dto.ts   # Balance response DTO
│   └── index.ts                  # Barrel export
├── enums/
│   └── transaction-type.enum.ts  # CREDIT/DEBIT enum
├── filters/
│   └── http-exception.filter.ts  # Exception handling
├── interceptors/
│   └── logging.interceptor.ts    # Request/response logging
├── interfaces/
│   └── user-context.interface.ts # User authentication context
├── transactions.controller.ts    # HTTP endpoints
├── transactions.service.ts       # Business logic
└── transactions.module.ts        # Module configuration
```

## API Endpoints

### 1. POST /transactions

Creates a new transaction (CREDIT or DEBIT).

**Request Body:**

```json
{
  "user_id": "uuid",
  "amount": 1000,
  "type": "CREDIT"
}
```

**Response:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "amount": 1000,
  "type": "CREDIT"
}
```

### 2. GET /transactions?type=CREDIT

Retrieves transactions with optional type filter.

**Query Parameters:**

- `type` (optional): `CREDIT` or `DEBIT`

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "amount": 1000,
    "type": "CREDIT"
  }
]
```

### 3. GET /balance

Returns consolidated balance (CREDIT - DEBIT).

**Response:**

```json
{
  "amount": 5000
}
```

## Key Features

### ✅ Implemented

- **DTOs with Validation**: Using class-validator for input validation
- **Type Safety**: TypeScript enums for transaction types
- **Clean Architecture**: Separation of concerns (Controller, Service, Entity)
- **Database Query Optimization**: Balance calculated at database level
- **Error Handling**: Structured exception handling
- **Logging**: Request/response logging interceptor

### ⏳ TODO: Authentication

The OpenAPI spec requires Bearer Token authentication (JWT). To implement:

1. **Install dependencies:**

   ```bash
   npm install @nestjs/jwt @nestjs/passport passport passport-jwt
   npm install -D @types/passport-jwt
   ```

2. **Create JWT Guard:**

   ```typescript
   // guards/jwt-auth.guard.ts
   import { Injectable } from '@nestjs/common';
   import { AuthGuard } from '@nestjs/passport';

   @Injectable()
   export class JwtAuthGuard extends AuthGuard('jwt') {}
   ```

3. **Uncomment guards in controller:**

   ```typescript
   @UseGuards(JwtAuthGuard)
   ```

4. **Configure JWT in module:**
   ```typescript
   imports: [
     JwtModule.register({
       secret: process.env.JWT_SECRET,
       signOptions: { expiresIn: '1h' },
     }),
   ];
   ```

## Database Entity

The `TransactionsEntity` includes:

- `id`: UUID primary key
- `user_id`: UUID reference to user
- `type`: Enum (CREDIT/DEBIT)
- `amount`: Decimal(10,2) for precise currency
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Usage Examples

### Creating a Transaction

```typescript
const transaction = await transactionsService.createTransaction({
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  amount: 1000,
  type: TransactionType.CREDIT,
});
```

### Querying Transactions

```typescript
// Get all transactions
const allTransactions = await transactionsService.getTransactions({});

// Get only CREDIT transactions
const credits = await transactionsService.getTransactions({
  type: TransactionType.CREDIT,
});
```

### Getting Balance

```typescript
const balance = await transactionsService.getBalance();
console.log(balance.amount); // Calculated balance
```

## Validation

All DTOs include validation decorators:

- `@IsNotEmpty()`: Required fields
- `@IsUUID()`: UUID format validation
- `@IsNumber()`: Numeric validation
- `@Min(0)`: Positive amounts only
- `@IsEnum()`: Transaction type validation

## Error Handling

Service methods throw appropriate exceptions:

- `BadRequestException`: Invalid data or operation failure
- `NotFoundException`: Resource not found (can be added as needed)

## Testing Recommendations

1. **Unit Tests** (transactions.service.spec.ts):
   - Test createTransaction with valid/invalid data
   - Test getTransactions with filters
   - Test getBalance calculation
   - Mock repository methods

2. **Integration Tests** (transactions.controller.spec.ts):
   - Test endpoints with real requests
   - Test validation errors
   - Test authentication (once implemented)

3. **E2E Tests** (test/transactions.e2e-spec.ts):
   - Full flow testing
   - Database integration
   - Error scenarios

## Environment Variables

Add to `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=wallet_db

# JWT (when implemented)
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
```

## Next Steps

1. ✅ Basic structure implemented
2. ⏳ Implement JWT authentication
3. ⏳ Add unit tests
4. ⏳ Add integration tests
5. ⏳ Add user-specific transaction filtering
6. ⏳ Add pagination for getTransactions
7. ⏳ Add transaction history per user
8. ⏳ Add soft delete functionality
9. ⏳ Add transaction reversal logic

## Best Practices Followed

- ✅ Single Responsibility Principle
- ✅ Dependency Injection
- ✅ DTO pattern for data validation
- ✅ Repository pattern
- ✅ Consistent error handling
- ✅ Type safety with TypeScript
- ✅ Clean code principles
- ✅ Proper documentation
