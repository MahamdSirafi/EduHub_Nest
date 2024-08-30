import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateApplyDto {
  @ApiProperty()
  @IsUUID()
  readonly courseId: string;
}

export class RatingApplyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Min(1)
  readonly rating: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly note: string;
}

export class ResultApplyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly result: number;
}
