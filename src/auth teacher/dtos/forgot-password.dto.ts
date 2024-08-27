import { IsEmail, IsString } from 'class-validator';
import { IsExist } from '../../common/decorators';
import { Entities } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { item_not_found } from '../../common/constants';

export class ForgotPasswordDto {
  @ApiProperty({ default: 'ibo@dev.io' })
  @IsString()
  @IsEmail()
  @IsExist(Entities.User, { message: item_not_found(Entities.User) })
  readonly email: string;
}
