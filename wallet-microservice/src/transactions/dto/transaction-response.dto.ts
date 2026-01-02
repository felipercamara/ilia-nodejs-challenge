import { TransactionType } from '../enums/transaction-type.enum';

/**
 * DTO for transaction response
 * Based on OpenAPI specification: TransactionsModel schema
 */
export class TransactionResponseDto {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;

  constructor(partial: Partial<TransactionResponseDto>) {
    Object.assign(this, partial);
  }
}
