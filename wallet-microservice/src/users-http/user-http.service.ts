import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { FAILED_TO_CONNECT_USER_SERVICE } from '@src/utils/constants';

export interface UserValidationResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

/**
 * User HTTP Service
 * Handles communication with User Microservice
 * Uses internal communication with JWT_INTERNAL secret
 */
@Injectable()
export class UserHttpService {
  private readonly logger = new Logger(UserHttpService.name);
  private readonly userServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl =
      this.configService.get<string>('USER_SERVICE_URL') ||
      'http://localhost:3002';
  }

  /**
   * Validate if user exists in User Microservice
   * @param userId - User ID to validate
   * @returns User data if valid
   * @throws UnauthorizedException if user not found or invalid
   */
  async validateUser(
    userId: string,
    authToken: string,
  ): Promise<UserValidationResponse> {
    try {
      this.logger.log(`Validating user ${userId} with User Microservice`);

      const response = await firstValueFrom(
        this.httpService.get<UserValidationResponse>(
          `${this.userServiceUrl}/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to validate user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new UnauthorizedException(FAILED_TO_CONNECT_USER_SERVICE);
    }
  }
}
