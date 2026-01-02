import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionsEntity } from '@src/entities/transactions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionsEntity)
    private transactionsRepository: Repository<TransactionsEntity>,
  ) {}

  findAll(): Promise<TransactionsEntity[]> {
    return this.transactionsRepository.find();
  }

  findOne(id: string): Promise<TransactionsEntity | null> {
    return this.transactionsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.transactionsRepository.delete(id);
  }
}
