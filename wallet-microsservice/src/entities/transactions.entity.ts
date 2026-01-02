import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WalletEntity } from './wallets.entity';

@Entity('transactions')
export class TransactionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WalletEntity)
  @JoinColumn({ name: 'walletId' })
  wallet: WalletEntity;

  @Column()
  walletId: string;

  @Column()
  type: string;

  @Column()
  amount: number;
}
