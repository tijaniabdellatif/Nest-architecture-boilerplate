import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { NotFoundException } from '@nestjs/common';

jest.mock('../guards/auth.guard', () => ({
  AuthGuard: jest.fn(() => true), // Mock implementation
}));

describe('UsersController', () => {
  let controller: UsersController;
  let mockUserService: Partial<UsersService>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockUserService = {
      findOne: jest.fn((id: number) =>
        Promise.resolve({
          id,
          email: 'asdf@gmail.com',
          password: 'mypass',
        } as UserEntity),
      ),
      find: jest.fn((email: string) =>
        Promise.resolve([{ id: 1, email, password: 'mypass' } as UserEntity]),
      ),
    };

    // Define mock implementations for AuthService
    mockAuthService = {
      signup: jest.fn((email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as UserEntity),
      ),
      signin: jest.fn((email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as UserEntity),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService, // Inject the mock UsersService
        },
        {
          provide: AuthService,
          useValue: mockAuthService, // Inject the mock AuthService
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findByEmail('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findById('1');
    expect(user).toBeDefined();
  });
  it('findUser throws an error if user with given id is not found', async () => {
    mockUserService.findOne = () => null;
    await expect(controller.findById('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = {userId: -10};
    const user = await controller.signin(
      { email: 'asf@asf.com', password: 'mypass' },
      session,
    );
     expect(user.id).toEqual(1);
     expect(session.userId).toEqual(1);
  });
});
