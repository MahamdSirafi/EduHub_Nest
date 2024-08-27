import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDto {
  @ApiProperty({ default: 'super@dev.io' })
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  readonly email: string;

  @ApiProperty({ default: 'test1234' })
  @IsString()
  @Length(6, 16)
  readonly password: string;
}
