import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from '../dtos';
import { Course } from '../entities/course.entity';
import { Entities } from '../../../common/enums';
import { item_not_found } from '../../../common/constants';
import { PaginatedResponse } from '../../../common/types';
import { CourseRepository } from '../repositories/course.repository';
import { Teacher } from '../../teachers';

@Injectable()
export class CourseService {
  constructor(private courseRepository: CourseRepository) {}

  async create(teatcher: Teacher, dto: CreateCourseDto): Promise<Course> {
    return this.courseRepository.create(teatcher, dto);
  }

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<Course> | Course[]> {
    return this.courseRepository.find(page, limit, withDeleted);
  }

  async findMyCourses(teacherId: string): Promise<Course[]> {
    return this.courseRepository.findMyCourses(teacherId);
  }

  async checkOwner(teacherId: string, courseId: string): Promise<Course> {
    return this.courseRepository.checkOwner(teacherId, courseId);
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOneById(id);
    if (!course) throw new NotFoundException(item_not_found(Entities.Course));
    return course;
  }

  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    return await this.courseRepository.update(course, dto);
  }

  async remove(id: string): Promise<void> {
    const teacher = await this.findOne(id);
    await this.courseRepository.remove(teacher);
    return;
  }
}
