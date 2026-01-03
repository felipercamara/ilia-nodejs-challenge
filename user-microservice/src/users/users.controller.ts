import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';

/**
 * Users Controller
 * Handles all user-related endpoints
 * Most endpoints require Bearer Token authentication
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Creates a new user (public endpoint - no auth required)
   * @param createUserDto - User creation data
   * @returns Created user details without password
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Retrieves all users (requires authentication)
   * @returns List of users without passwords
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Retrieves a specific user by ID (requires authentication)
   * @param id - User ID
   * @returns User details without password
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id
   * Updates a user (requires authentication)
   * @param id - User ID
   * @param updateUserDto - User update data
   * @returns Updated user details without password
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id
   * Deletes a user (requires authentication)
   * @param id - User ID
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
