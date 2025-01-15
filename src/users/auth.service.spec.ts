import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { scryptSync } from 'crypto';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUser: Partial<UsersService>;

  beforeEach(async () => {
    //Fake copy of userService

    const users: UserEntity[] = [];

    fakeUser = {
      find: jest.fn((email: string) => {
        const filtred = users.filter((user) => {
          return user.email === email;
        });
        return Promise.resolve(filtred);
      }),
      create: jest.fn((email: string, password: string) => {
        const id = Math.floor(Math.random() * 999999);
        const user = { id: id, email, password } as UserEntity;
        users.push(user);
        return Promise.resolve(user);
      }),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUser,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Creates a new user with hashed password', async () => {
    const user = await service.signup('tijani.a@gmail.com', '23061988');
    expect(user.password).not.toEqual('23061988');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signup with email that is in use', async () => {
    // (fakeUser.find as jest.Mock).mockResolvedValueOnce([
    //   { id: 1, email: 'a', password: '1' } as UserEntity,
    // ]);
    await service.signup('abdellatif@gmail.com', '23038');
    await expect(
      service.signup('abdellatif@gmail.com', '23038'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if signin is called with unused email', async () => {
    await expect(
      service.signin('abdelaajfa@fklanfal.com', 'password'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    (fakeUser.find as jest.Mock).mockResolvedValueOnce([
      { email: 'abde@abde.fr', password: 'whatever' } as UserEntity,
    ]);

    await expect(
      service.signin('abdellatif@gmail.com', 'badpassword'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('abdellatif@gmail.com', 'mypassword');
    const user = await service.signin('abdellatif@gmail.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
