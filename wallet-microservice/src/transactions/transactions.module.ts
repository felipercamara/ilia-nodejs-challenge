import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsEntity } from '@src/entities/transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionsEntity])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
