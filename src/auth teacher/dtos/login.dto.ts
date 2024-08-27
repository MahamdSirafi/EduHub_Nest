import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';

export abstract class LoginDto {
  @ApiProperty({ default: 'tea@gmail.com' })
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  readonly email: string;

  @ApiProperty({ default: '123454321' })
  @IsString()
  @Length(6, 16)
  readonly password: string;
}
