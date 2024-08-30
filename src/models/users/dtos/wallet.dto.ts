import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateWalletDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  readonly cost: number;
}
