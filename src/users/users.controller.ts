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
  Session,
  UseGuards
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user-dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user-dto';
import { Serialize } from '../interceptors/serialize-interceptor';
import { UserDTO } from './dtos/user-dto';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { CurrentUser } from './decorators/currentuser-decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDTO)


export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

 
  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;

    return user;
  }

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
