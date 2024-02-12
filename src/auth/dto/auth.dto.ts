import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'First name cannot be empty' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  lastName: string;
}
