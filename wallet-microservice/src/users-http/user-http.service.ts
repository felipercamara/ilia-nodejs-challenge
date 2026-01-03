import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

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
  private readonly internalToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl =
      this.configService.get<string>('USER_SERVICE_URL') ||
      'http://localhost:3002';

    // For internal communication, we can use a shared secret or JWT_INTERNAL
    this.internalToken =
      this.configService.get<string>('JWT_INTERNAL_SECRET') || '';
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
      throw new UnauthorizedException(
        'Failed to validate user with User Microservice',
      );
    }
  }

  /**
   * Get user details from User Microservice
   * @param userId - User ID
   * @param authToken - JWT token for authentication
   * @returns User data
   */
  async getUserById(
    userId: string,
    authToken: string,
  ): Promise<UserValidationResponse> {
    try {
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
        `Failed to get user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new UnauthorizedException('Failed to fetch user data');
    }
  }
}
