import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionType } from '../enums/transaction-type.enum';
import { TransactionsService } from '../transactions.service';
import { TransactionsEntity } from '@src/entities/transactions.entity';

describe('TransactionService', () => {
  let service: TransactionsService;
  let repository: Repository<TransactionsEntity>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(TransactionsEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<Repository<TransactionsEntity>>(
      getRepositoryToken(TransactionsEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createDto: CreateTransactionDto = {
        user_id: '709d2907-fc0f-4abd-b4e8-ff50441bb7f2',
        amount: 100,
        type: TransactionType.CREDIT,
      };

      const transaction = { id: '1', ...createDto };
      mockRepository.create.mockReturnValue(transaction);
      mockRepository.save.mockResolvedValue(transaction);

      const result = await service.createTransaction(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(transaction);
      expect(result).toEqual(transaction);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const transactions = [
        {
          id: '1',
          user_id: '709d2907-fc0f-4abd-b4e8-ff50441bb7f2',
          amount: 100,
          type: TransactionType.CREDIT,
        },
        {
          id: '2',
          user_id: '709d2907-fc0f-4abd-b4e8-ff50441bb7f2',
          amount: 50,
          type: TransactionType.DEBIT,
        },
      ];

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(transactions),
      };

      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getTransactions({});

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'transaction',
      );
      expect(result).toEqual([
        {
          id: '1',
          user_id: '709d2907-fc0f-4abd-b4e8-ff50441bb7f2',
          amount: 100,
          type: TransactionType.CREDIT,
        },
        {
          id: '2',
          user_id: '709d2907-fc0f-4abd-b4e8-ff50441bb7f2',
          amount: 50,
          type: TransactionType.DEBIT,
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const transaction = {
        id: '1',
        user_id: '709d2907-fc0f-4abd-b4e8-ff50441bb7f2',
        amount: 100,
        type: TransactionType.CREDIT,
      };
      mockRepository.findOneBy.mockResolvedValue(transaction);

      const result = await service.findOne('1');

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(transaction);
    });
  });
});
