import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users.service';
import { UsersEntity } from '../../entities/users.entity';
import { CreateUserDto, UpdateUserDto } from '../dto';

// Mock bcrypt at the module level
jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<UsersEntity>>;
  let jwtService: jest.Mocked<JwtService>;

  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    first_name: 'Test',
    last_name: 'User',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(UsersEntity));
    jwtService = module.get(JwtService);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password',
        first_name: 'New',
        last_name: 'User',
      };
      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(mockUser as any);
      repository.save.mockResolvedValue(mockUser as any);
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword' as any);

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
    });

    it('should throw ConflictException if email exists', async () => {
      repository.findOne.mockResolvedValue(mockUser as any);

      await expect(
        service.create({
          email: 'test@example.com',
          password: 'pass',
          first_name: 'User',
          last_name: 'Test',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      repository.find.mockResolvedValue([mockUser] as any);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: '1',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      repository.findOne.mockResolvedValue(mockUser as any);

      const result = await service.findOne('1');

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateDto: UpdateUserDto = {
        first_name: 'Updated',
        last_name: 'Name',
      };
      const userToUpdate = { ...mockUser };
      repository.findOne.mockResolvedValue(userToUpdate as any);
      repository.save.mockResolvedValue({
        ...userToUpdate,
        ...updateDto,
      } as any);

      const result = await service.update('1', updateDto);

      expect(result.first_name).toBe('Updated');
      expect(result.last_name).toBe('Name');
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('999', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      repository.findOne
        .mockResolvedValueOnce(mockUser as any)
        .mockResolvedValueOnce({ id: '2', email: 'other@example.com' } as any);

      await expect(
        service.update('1', { email: 'other@example.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await expect(service.remove('1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('login', () => {
    it('should login successfully and return token', async () => {
      const loginDto = {
        user: { email: 'test@example.com', password: 'password' },
      };
      repository.findOne.mockResolvedValue(mockUser as any);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true as any);
      jwtService.sign.mockReturnValue('token');

      const result = await service.login(loginDto);

      expect(result.access_token).toBe('token');
      expect(result.user).toEqual({
        id: '1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.login({
          user: { email: 'test@example.com', password: 'pass' },
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      repository.findOne.mockResolvedValue(mockUser as any);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false as any);

      await expect(
        service.login({
          user: { email: 'test@example.com', password: 'wrong' },
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
