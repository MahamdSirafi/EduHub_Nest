import { Module } from '@nestjs/common';
import { CourseRepository } from './repositories/course.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CourseController } from './controllers/courses.controller';
import { CourseService } from './services/courser.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CourseController],
  providers: [CourseRepository, CourseService],
  exports: [CourseRepository, CourseService],
})
export class CoursesModule {}
