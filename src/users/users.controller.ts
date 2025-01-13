import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  Query,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user-dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user-dto';
import { SerializeInterceptor } from '../interceptors/serialize-interceptor';
import { UserDTO } from './dtos/user-dto';


@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDTO) {
    this.userService.create(body.email, body.password);
  }

  @UseInterceptors(new SerializeInterceptor(UserDTO))
  @Get('/:id')
  async findById(@Param('id') id: string) {
    console.log('the handler is running');
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found', {
        cause: 'Surely a bad transaction',
        description: 'The user is not found due to some bad transaction',
      });
    }

    return user;
  }

  @Get()
  findByEmail(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
