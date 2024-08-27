import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsUnique } from '../../../common/decorators';
import { Entities } from '../../../common/enums';
import { Transform } from 'class-transformer';
import { item_already_exist } from '../../../common/constants';

export class CreateTeacherDto {
  @ApiProperty()
  @IsString()
  @Length(3, 16)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  @Transform(({ value }) => value.toLowerCase())
  @IsUnique(Entities.User, { message: item_already_exist('email') })
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 15)
  readonly password: string;
}
