import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { IsUnique } from '../../../common/decorators';
import { Entities } from '../../../common/enums';
import { Transform } from 'class-transformer';
import { item_already_exist } from '../../../common/constants';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'please provide titel' })
  @Length(3, 25)
  readonly titel: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'please provide classification' })
  readonly classification: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'please provide classification' })
  readonly photo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide price' })
  @IsNumber()
  readonly price: number;
}
