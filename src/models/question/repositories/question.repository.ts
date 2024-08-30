import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateQuestionDto, Question, UpdateQuestionDto } from '..';
import { pagination } from '../../../common/helpers';
import { PaginatedResponse } from '../../../common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAuthRepo } from '../../../common/entities';
import { Course } from '../../courses/entities/course.entity';

@Injectable()
export class QuestionRepository extends BaseAuthRepo<Question> {
  constructor(
    @InjectRepository(Question)
    private readonly QuestionRepo: Repository<Question>,
  ) {
    super(QuestionRepo);
  }

  async findForCourse(courseId: string): Promise<Question[]> {
    return this.QuestionRepo.find({
      where: { courseId: courseId },
    });
  }

  async create(course: Course, dto: CreateQuestionDto): Promise<Question> {
    const question = new Question();
    question.question = dto.question;
    question.course = course;
    question.A = dto.A;
    question.B = dto.B;
    question.C = dto.C;
    question.D = dto.D;
    question.answer = dto.answer;
    return this.QuestionRepo.save(question);
  }

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<Question>> {
    const skip = (page - 1) * limit || 0;
    const take = limit || 100;
    const data = await this.QuestionRepo.find({
      skip,
      take,
      withDeleted,
      relations: { course: true },
    });
    const totalDataCount = await this.QuestionRepo.count({ withDeleted });
    return pagination(page, limit, totalDataCount, data);
  }

  async findOneById(id: string, withDeleted = false): Promise<Question> {
    return await this.QuestionRepo.findOne({
      where: { id },
      withDeleted,
      relations: { course: true },
    });
  }

  async update(question: Question, dto: UpdateQuestionDto): Promise<Question> {
    Object.assign(question, {
      question: dto.question,
      A: dto.A,
      B: dto.B,
      C: dto.C,
      D: dto.D,
      answer: dto.answer,
    });
    await this.QuestionRepo.save(question);
    return this.findOneById(question.id);
  }

  async remove(question: Question): Promise<void> {
    this.QuestionRepo.softRemove(question);
  }
}
