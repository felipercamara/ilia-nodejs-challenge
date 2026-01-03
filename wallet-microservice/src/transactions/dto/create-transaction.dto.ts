import {
  IsEnum,
  IsNotEmpty,
  IsInt,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';

/**
 * DTO for creating a new transaction
 * Based on OpenAPI specification: Transactions schema
 */
export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;
}
