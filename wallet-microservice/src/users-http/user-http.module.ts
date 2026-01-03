import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UserHttpService } from './user-http.service';

/**
 * User HTTP Module
 * Provides HTTP client for communication with User Microservice
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  providers: [UserHttpService],
  exports: [UserHttpService],
})
export class UserHttpModule {}
