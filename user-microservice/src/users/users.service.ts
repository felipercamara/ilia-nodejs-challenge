import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersEntity } from '../entities/users.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  LoginDto,
  AuthResponseDto,
} from './dto';
import {
  EMAIL_ALREADY_EXISTS,
  INVALID_CREDENTIALS,
  USER_NOT_FOUND,
} from '@src/utils/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create a new user
   * @param createUserDto - User creation data
   * @returns Created user without password
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(EMAIL_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      parseInt(process.env.SALT || '10'),
    );

    // Create user
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    return this.toResponseDto(savedUser);
  }

  /**
   * Find all users
   * @returns Array of users without passwords
   */
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => this.toResponseDto(user));
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns User without password
   */
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return this.toResponseDto(user);
  }

  /**
   * Update user
   * @param id - User ID
   * @param updateUserDto - User update data
   * @returns Updated user without password
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    // Check if email is being updated and already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException(EMAIL_ALREADY_EXISTS);
      }
    }

    // Hash password if being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update user
    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);

    return this.toResponseDto(updatedUser);
  }

  /**
   * Delete user
   * @param id - User ID
   */
  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
  }

  /**
   * Authenticate user and generate JWT token
   * @param loginDto - Login credentials
   * @returns User data and access token
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.user.email },
    });

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.user.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      user: this.toResponseDto(user),
      access_token,
    };
  }

  /**
   * Convert entity to response DTO (exclude password)
   * @param user - User entity
   * @returns User response DTO
   */
  private toResponseDto(user: UsersEntity): UserResponseDto {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
