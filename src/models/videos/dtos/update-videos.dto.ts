import { PartialType } from '@nestjs/swagger';
import { CreateVideoDto } from './create-videos.dto';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {}
