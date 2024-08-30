import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Apply } from '../entities/apply.entity';
import { Entities } from '../../../common/enums';
import { item_not_found } from '../../../common/constants';
import { PaginatedResponse } from '../../../common/types';
import { ApplyRepository } from '../repositories/apply.repository';
import { Course } from '../../courses';
import {
  CreateApplyDto,
  RatingApplyDto,
  ResultApplyDto,
} from '../dtos/apply.dto';
import { User } from '../../users';

@Injectable()
export class ApplyService {
  constructor(private ApplyRepo: ApplyRepository) {}

  async create(
    user: User,
    course: Course,
    dto: CreateApplyDto,
  ): Promise<Apply> {
    if (!course)
      throw new NotFoundException('this course with id is not found');
    return this.ApplyRepo.create(user, course, dto);
  }

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<Apply> | Apply[]> {
    return this.ApplyRepo.find(page, limit, withDeleted);
  }

  async findForCourse(courseId: string): Promise<Apply[]> {
    return this.ApplyRepo.findForCourse(courseId);
  }

  async checkApply(courseId: string, userId: string): Promise<Apply> {
    return this.ApplyRepo.checkApply(courseId, userId);
  }

  async findForUser(userId: string): Promise<Apply[]> {
    return this.ApplyRepo.findForUser(userId);
  }

  async findOne(id: string): Promise<Apply> {
    const video = await this.ApplyRepo.findOneById(id);
    if (!video) throw new NotFoundException(item_not_found(Entities.Apply));
    return video;
  }

  async rating(
    id: string,
    dto: RatingApplyDto,
    userId: string,
  ): Promise<Apply> {
    const apply = await this.findOne(id);
    if (apply.userId !== userId)
      throw new ForbiddenException('Can not rating this course');
    return await this.ApplyRepo.rating(apply, dto);
  }

  async setResult(
    id: string,
    dto: ResultApplyDto,
    userId: string,
  ): Promise<Apply> {
    const apply = await this.findOne(id);
    if (apply.userId !== userId)
      throw new ForbiddenException("Can not set result this course's test");
    return await this.ApplyRepo.setReuslt(apply, dto);
  }

  async remove(id: string, teacherId: string): Promise<void> {
    const apply = await this.findOne(id);
    if (apply.course.teacherId !== teacherId)
      throw new ForbiddenException('Can not delete this apply');
    await this.ApplyRepo.remove(apply);
    return;
  }
}
