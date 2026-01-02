import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions.module';

@Module({
  imports: [TransactionsModule],
})
export class TransactionsHttpModule {}
