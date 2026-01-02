import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Strategy
 * Validates JWT tokens using the ILIACHALLENGE secret
 * Extracts user payload from valid tokens
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'ILIACHALLENGE',
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
      throw new UnauthorizedException('Invalid token payload');
    }

    // Return user context to be attached to request object
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}
