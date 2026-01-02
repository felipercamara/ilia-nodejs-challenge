import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth';
import {
  CreateTransactionDto,
  TransactionResponseDto,
  QueryTransactionDto,
  BalanceResponseDto,
} from './dto';

/**
 * Transactions Controller
 * Handles all transaction-related endpoints
 * All endpoints require Bearer Token authentication (security: bearerAuth)
 */
@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * POST /transactions
   * Creates a new transaction (CREDIT or DEBIT)
   * @param createTransactionDto - Transaction data
   * @returns Created transaction details
   */
  @Post('transactions')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  /**
   * GET /transactions
   * Retrieves transactions with optional type filter
   * @param query - Query parameters (type: CREDIT or DEBIT)
   * @returns List of transactions
   */
  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(
    @Query() query: QueryTransactionDto,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionsService.getTransactions(query);
  }

  /**
   * GET /balance
   * Returns consolidated balance from all CREDIT and DEBIT transactions
   * Calculation: SUM(CREDIT amounts) - SUM(DEBIT amounts)
   * @returns Balance amount
   */
  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(): Promise<BalanceResponseDto> {
    return this.transactionsService.getBalance();
  }
}
