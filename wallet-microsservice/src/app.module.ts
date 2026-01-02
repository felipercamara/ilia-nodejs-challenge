import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsEntity } from './entities/transactions.entity';
import { WalletEntity } from './entities/wallets.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'wallet_user',
      password: process.env.DB_PASSWORD || 'wallet_pass',
      database: process.env.DB_NAME || 'wallet_db',
      synchronize: true,
      entities: [TransactionsEntity, WalletEntity],
      migrations: ['./migrations/*{.ts,.js}'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
