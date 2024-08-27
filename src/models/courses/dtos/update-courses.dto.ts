import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-courses.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
}
