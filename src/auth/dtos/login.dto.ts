import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';

export abstract class LoginDto {
  @ApiProperty({ default: 'ibo@dev.io' })
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  readonly email: string;

  @ApiProperty({ default: 'test1234' })
  @IsString()
  @Length(6, 16)
  readonly password: string;
}
