import { IsEnum, IsOptional } from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';

/**
 * DTO for filtering transactions
 * Used in GET /transactions endpoint
 */
export class QueryTransactionDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
