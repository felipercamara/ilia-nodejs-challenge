import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto, AuthResponseDto } from '../users/dto';

/**
 * Auth Controller
 * Handles authentication endpoints
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /auth
   * Authenticates user and returns JWT token
   * @param loginDto - Login credentials
   * @returns User data and access token
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.usersService.login(loginDto);
  }
}
