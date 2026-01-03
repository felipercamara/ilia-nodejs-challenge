import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsEntity } from '@src/entities/transactions.entity';
import { UserHttpModule } from '../users-http';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionsEntity]), UserHttpModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
