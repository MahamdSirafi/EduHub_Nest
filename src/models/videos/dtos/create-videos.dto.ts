import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'please provide titel' })
  @Length(3, 25)
  readonly titel: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty({ message: 'please provide video' })
  readonly video: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide description' })
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide level' })
  @IsString()
  readonly level: string;
}
