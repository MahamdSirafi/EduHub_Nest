import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavoritesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsUUID('all', { each: true })
  readonly favoriteCities: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  @IsUUID('all', { each: true })
  readonly favoriteCategories: string[];
}
