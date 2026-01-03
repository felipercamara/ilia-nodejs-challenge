import { Module } from '@nestjs/common';
import { UsersEntity } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';

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
      entities: [UsersEntity],
      migrations: ['./migrations/*{.ts,.js}'],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
