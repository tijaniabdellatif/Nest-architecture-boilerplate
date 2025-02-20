import { IsEmail, IsNotEmpty, IsString, validate } from 'class-validator';

export class CreateUserDTO {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}


