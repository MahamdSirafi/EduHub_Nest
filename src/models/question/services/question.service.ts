import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto, UpdateQuestionDto } from '../dtos';
import { Question } from '../entities/question.entity';
import { Entities } from '../../../common/enums';
import { item_not_found } from '../../../common/constants';
import { PaginatedResponse } from '../../../common/types';
import { QuestionRepository } from '../repositories/question.repository';
import { Course } from '../../courses';

@Injectable()
export class QuestionService {
  constructor(private questionRepo: QuestionRepository) {}

  async create(course: Course, dto: CreateQuestionDto): Promise<Question> {
    if (!course) throw new ForbiddenException('Can not create a video');
    return this.questionRepo.create(course, dto);
  }

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<Question> | Question[]> {
    return this.questionRepo.find(page, limit, withDeleted);
  }

  async findForCourse(courseId: string): Promise<Question[]> {
    return this.questionRepo.findForCourse(courseId);
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionRepo.findOneById(id);
    if (!question)
      throw new NotFoundException(item_not_found(Entities.Question));
    return question;
  }

  async update(
    id: string,
    dto: UpdateQuestionDto,
    teacherId: string,
  ): Promise<Question> {
    const question = await this.findOne(id);
    if (question.course.teacherId !== teacherId)
      throw new ForbiddenException('Can not update this question');
    return await this.questionRepo.update(question, dto);
  }

  async remove(id: string, teacherId: string): Promise<void> {
    const question = await this.findOne(id);
    if (question.course.teacherId !== teacherId)
      throw new ForbiddenException('Can not delete this question');
    await this.questionRepo.remove(question);
    return;
  }
}
