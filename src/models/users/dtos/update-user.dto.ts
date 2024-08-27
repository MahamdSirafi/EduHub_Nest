import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Length,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { IsPhotoExist, IsUnique } from '../../../common/decorators';
import { Entities } from '../../../common/enums';
import { Transform } from 'class-transformer';
import { getPhotoPath } from '../../../common/helpers';
import { item_already_exist, item_not_found } from '../../../common/constants';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(3, 16)
  @ApiProperty({ required: false })
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email' })
  @Transform(({ value }) => value.toLowerCase())
  @IsUnique(Entities.User, { message: item_already_exist('email') })
  readonly email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => getPhotoPath(value))
  @IsPhotoExist({ message: item_not_found(Entities.Photo) })
  readonly photo?: string;
}
