import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {
  INVALID_TOKEN_PAYLOAD,
  MISSING_JWT_SECRET,
} from '@src/utils/constants';

/**
 * JWT Strategy
 * Validates JWT tokens using the ILIACHALLENGE secret
 * Extracts user payload from valid tokens
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error(MISSING_JWT_SECRET);
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Validates the JWT payload
   * This method is called automatically by Passport after token validation
   * @param payload - Decoded JWT payload
   * @returns User context with userId
   */
  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException(INVALID_TOKEN_PAYLOAD);
    }

    // Return user context to be attached to request object
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
