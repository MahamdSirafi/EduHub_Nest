import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNotEmpty,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { IsPhotoExist, IsUnique } from '../../../common/decorators';
import { Entities } from '../../../common/enums';
import { Transform } from 'class-transformer';
import { getPhotoPath } from '../../../common/helpers';
import { item_already_exist } from '../../../common/constants';

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @Length(3, 16)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide email' })
  @IsEmail({}, { message: 'please provide valid email' })
  @Transform(({ value }) => value.toLowerCase())
  @IsUnique(Entities.Admin, { message: item_already_exist('email') })
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 15)
  readonly password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => getPhotoPath(value))
  @IsPhotoExist()
  readonly photo?: string;
}
