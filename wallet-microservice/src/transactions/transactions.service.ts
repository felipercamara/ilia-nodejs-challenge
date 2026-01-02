import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionsEntity } from '@src/entities/transactions.entity';
import {
  CreateTransactionDto,
  TransactionResponseDto,
  QueryTransactionDto,
  BalanceResponseDto,
} from './dto';
import { TransactionType } from './enums/transaction-type.enum';

/**
 * Transactions Service
 * Handles business logic for transaction operations
 */
@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionsEntity)
    private readonly transactionsRepository: Repository<TransactionsEntity>,
  ) {}

  /**
   * Creates a new transaction
   * @param createTransactionDto - Transaction data
   * @returns Created transaction
   */
  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    try {
      // Create new transaction entity
      const transaction = this.transactionsRepository.create({
        user_id: createTransactionDto.user_id,
        amount: createTransactionDto.amount,
        type: createTransactionDto.type,
      });

      // Save transaction to database
      const savedTransaction =
        await this.transactionsRepository.save(transaction);

      // Map to response DTO
      return this.mapToResponseDto(savedTransaction);
    } catch (error) {
      throw new BadRequestException('Failed to create transaction');
    }
  }

  /**
   * Retrieves transactions with optional type filter
   * @param query - Query parameters (type filter)
   * @returns List of transactions
   */
  async getTransactions(
    query: QueryTransactionDto,
  ): Promise<TransactionResponseDto[]> {
    try {
      // Build query
      const queryBuilder =
        this.transactionsRepository.createQueryBuilder('transaction');

      // Apply type filter if provided
      if (query.type) {
        queryBuilder.where('transaction.type = :type', { type: query.type });
      }

      // Execute query
      const transactions = await queryBuilder.getMany();

      // Map to response DTOs
      return transactions.map((transaction) =>
        this.mapToResponseDto(transaction),
      );
    } catch (error) {
      throw new BadRequestException('Failed to retrieve transactions');
    }
  }

  /**
   * Calculates and returns the balance
   * Balance = SUM(CREDIT amounts) - SUM(DEBIT amounts)
   * Uses database query for optimal performance
   * @returns Balance amount
   */
  async getBalance(): Promise<BalanceResponseDto> {
    try {
      // Query to calculate balance directly in database
      const result = await this.transactionsRepository
        .createQueryBuilder('transaction')
        .select(
          `
          SUM(CASE WHEN transaction.type = :credit THEN transaction.amount ELSE 0 END) -
          SUM(CASE WHEN transaction.type = :debit THEN transaction.amount ELSE 0 END)
        `,
          'balance',
        )
        .setParameters({
          credit: TransactionType.CREDIT,
          debit: TransactionType.DEBIT,
        })
        .getRawOne();

      const balance = result?.balance ? parseFloat(result.balance) : 0;

      return new BalanceResponseDto(balance);
    } catch (error) {
      throw new BadRequestException('Failed to calculate balance');
    }
  }

  /**
   * Maps transaction entity to response DTO
   * @param transaction - Transaction entity
   * @returns Transaction response DTO
   */
  private mapToResponseDto(
    transaction: TransactionsEntity,
  ): TransactionResponseDto {
    return new TransactionResponseDto({
      id: transaction.id,
      user_id: transaction.user_id,
      amount: transaction.amount,
      type: transaction.type as TransactionType,
    });
  }

  /**
   * Finds a transaction by ID
   * @param id - Transaction ID
   * @returns Transaction or null
   */
  async findOne(id: string): Promise<TransactionsEntity | null> {
    return this.transactionsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.transactionsRepository.delete(id);
  }
}
