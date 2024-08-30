import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'please provide question' })
  readonly question: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'please provide answer A' })
  readonly A: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide answer B' })
  @IsString()
  readonly B: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide answer C' })
  @IsString()
  readonly C: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide answer D' })
  @IsString()
  readonly D: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'please provide correct answer' })
  @IsEnum(['A', 'B', 'C', 'D'])
  readonly answer: string;
}
