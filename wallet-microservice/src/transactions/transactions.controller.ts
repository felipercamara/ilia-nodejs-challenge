import { Controller } from '@nestjs/common';
import { TransactionsService } from '@src/transactions/transactions.service';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}
}
