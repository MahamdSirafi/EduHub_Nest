import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Apply } from '..';
import { pagination } from '../../../common/helpers';
import { PaginatedResponse } from '../../../common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAuthRepo } from '../../../common/entities';
import { Course } from '../../courses/entities/course.entity';
import {
  CreateApplyDto,
  RatingApplyDto,
  ResultApplyDto,
} from '../dtos/apply.dto';
import { User } from '../../users';

@Injectable()
export class ApplyRepository extends BaseAuthRepo<Apply> {
  constructor(
    @InjectRepository(Apply)
    private readonly ApplyRepo: Repository<Apply>,
  ) {
    super(ApplyRepo);
  }

  async findForCourse(courseId: string): Promise<Apply[]> {
    return this.ApplyRepo.find({
      where: { courseId: courseId },
      relations: { user: true },
    });
  }

  async findForUser(userId: string): Promise<Apply[]> {
    return this.ApplyRepo.find({
      where: { userId },
      relations: { course: true },
    });
  }

  async create(
    user: User,
    course: Course,
    dto: CreateApplyDto,
  ): Promise<Apply> {
    const aplly = new Apply();
    aplly.user = user;
    aplly.course = course;
    return this.ApplyRepo.save(aplly);
  }

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<Apply>> {
    const skip = (page - 1) * limit || 0;
    const take = limit || 100;
    const data = await this.ApplyRepo.find({
      skip,
      take,
      withDeleted,
      relations: { course: true },
    });
    const totalDataCount = await this.ApplyRepo.count({ withDeleted });
    return pagination(page, limit, totalDataCount, data);
  }

  async checkApply(courseId: string, userId: string): Promise<Apply> {
    return this.ApplyRepo.findOne({ where: { courseId, userId } });
  }

  async findOneById(id: string, withDeleted = false): Promise<Apply> {
    return await this.ApplyRepo.findOne({
      where: { id },
      withDeleted,
      relations: { course: true },
    });
  }

  async rating(apply: Apply, dto: RatingApplyDto): Promise<Apply> {
    Object.assign(apply, {
      rating: dto.rating,
      note: dto.note,
    });
    await this.ApplyRepo.save(apply);
    return this.findOneById(apply.id);
  }

  async setReuslt(apply: Apply, dto: ResultApplyDto): Promise<Apply> {
    Object.assign(apply, {
      result: dto.result,
    });
    await this.ApplyRepo.save(apply);
    return this.findOneById(apply.id);
  }

  async remove(apply: Apply): Promise<void> {
    this.ApplyRepo.softRemove(apply);
  }
}
