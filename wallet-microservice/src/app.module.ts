import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsEntity } from './entities/transactions.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'wallet_user',
      password: process.env.DB_PASSWORD || 'wallet_pass',
      database: process.env.DB_NAME || 'wallet_db',
      synchronize: process.env.NODE_ENV !== 'production',
      entities: [TransactionsEntity],
      migrations: ['./migrations/*{.ts,.js}'],
    }),
    AuthModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
