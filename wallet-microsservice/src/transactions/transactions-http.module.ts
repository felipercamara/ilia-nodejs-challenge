import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions.module';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [TransactionsModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsHttpModule {}
