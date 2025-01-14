import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const existing = await this.userService.find(email);

    if (existing.length) {
      throw new BadRequestException('email already in use', {
        cause: 'email exists',
        description: 'Email already in use try another email !',
      });
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;
    const newUser = await this.userService.create(email, result);

    return newUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('User not Found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new ForbiddenException('Bad password');
    }

    return user;
  }
}
