import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionsController } from '../transactions.controller';
import { TransactionsService } from '../transactions.service';
import { TransactionType } from '../enums/transaction-type.enum';

describe('TransactionController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionService = {
    createTransaction: jest.fn(),
    getTransactions: jest.fn(),
    getBalance: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthToken = 'Bearer mock-jwt-token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const dto: CreateTransactionDto = {
        user_id: '709d2907-fc0f-4abd-b4e8-ff50441bb7f2',
        type: TransactionType.CREDIT,
        amount: 100,
      };
      const result = { id: '1', ...dto, createdAt: new Date() };

      mockTransactionService.createTransaction.mockResolvedValue(result);

      expect(await controller.createTransaction(dto, mockAuthToken)).toEqual(
        result,
      );
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        dto,
        'mock-jwt-token',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const mockUser = { userId: '709d2907-fc0f-4abd-b4e8-ff50441bb7f2' };
      const result = [
        {
          id: '1',
          user_id: '709d2907-fc0f-4abd-b4e8-ff50441bb7f2',
          type: TransactionType.CREDIT,
          amount: 100,
        },
      ];

      mockTransactionService.getTransactions.mockResolvedValue(result);

      expect(await controller.getTransactions({}, mockUser as any)).toEqual(result);
      expect(mockTransactionService.getTransactions).toHaveBeenCalledWith({}, mockUser.userId);
    });
  });
});
