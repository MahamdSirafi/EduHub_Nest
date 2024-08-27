import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCourseDto, UpdateCourseDto, Course } from '..';
import { pagination } from '../../../common/helpers';
import { PaginatedResponse } from '../../../common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAuthRepo } from '../../../common/entities';
import { Teacher } from '../../teachers';

@Injectable()
export class CourseRepository extends BaseAuthRepo<Course> {
  constructor(
    @InjectRepository(Course)
    private readonly CourseRepo: Repository<Course>,
  ) {
    super(CourseRepo);
  }

  async findMyCourses(teacherId: string): Promise<Course[]> {
    return this.CourseRepo.find({
      where: { teacherId },
    });
  }

  async create(teacher: Teacher, dto: CreateCourseDto): Promise<Course> {
    const course = new Course();
    course.photo = dto.photo;
    course.teacher = teacher;
    course.titel = dto.titel;
    course.classification = dto.classification;
    course.price = dto.price;
    return this.CourseRepo.save(course);
  }

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<Course>> {
    const skip = (page - 1) * limit || 0;
    const take = limit || 100;
    const data = await this.CourseRepo.find({
      skip,
      take,
      withDeleted,
    });
    const totalDataCount = await this.CourseRepo.count({ withDeleted });
    return pagination(page, limit, totalDataCount, data);
  }

  async findOneById(id: string, withDeleted = false): Promise<Course> {
    return await this.CourseRepo.findOne({
      where: { id },
      withDeleted,
    });
  }

  async checkOwner(teacherId: string, courseId: string): Promise<Course> {
    return await this.CourseRepo.findOne({
      where: { id: courseId, teacherId },
    });
  }

  async update(course: Course, dto: UpdateCourseDto): Promise<Course> {
    Object.assign(course, {
      titel: dto.titel,
      price: dto.price,
      classification: dto.classification,
      photo: dto.photo,
    });
    await this.CourseRepo.save(course);
    return this.findOneById(course.id);
  }

  async remove(course: Course): Promise<void> {
    this.CourseRepo.softRemove(course);
  }
}
