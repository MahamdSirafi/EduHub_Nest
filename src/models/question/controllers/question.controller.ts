import {
  UseGuards,
  UseInterceptors,
  Controller,
  Get,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { CreateQuestionDto, UpdateQuestionDto } from '../dtos';
import { Question } from '../entities/question.entity';
import { GetUser, Roles } from '../../../common/decorators';
import { ROLE } from '../../../common/enums';
import { CaslAbilitiesGuard, RolesGuard } from '../../../common/guards';
import {
  LoggingInterceptor,
  WithDeletedInterceptor,
} from '../../../common/interceptors';
import { PaginatedResponse } from '../../../common/types';
import { ICrud } from '../../../common/interfaces';
import {
  bad_req,
  data_not_found,
  denied_error,
} from '../../../common/constants';
import { Request } from 'express';
import { QuestionService } from '../services/question.service';
import { CourseService } from '../../courses/services/courser.service';
import { Teacher } from '../../teachers';
import { User } from '../../users';
import { ApplyService } from '../../applies/services/apply.service';

@ApiTags('questions')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@UseInterceptors(new LoggingInterceptor())
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'questions', version: '1' })
export class QuestionController implements ICrud<Question> {
  constructor(
    private questionService: QuestionService,
    private coursesService: CourseService,
    private applyService: ApplyService,
  ) {}

  @Roles(ROLE.SUPER_ADMIN)
  @UseInterceptors(WithDeletedInterceptor)
  @ApiOkResponse({ type: PaginatedResponse<Question> })
  @ApiQuery({
    name: 'page',
    allowEmptyValue: false,
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    allowEmptyValue: false,
    example: 10,
    required: false,
  })
  @Get()
  async find(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: Request & { query: { withDeleted: string } },
  ) {
    const withDeleted = JSON.parse(req.query.withDeleted);
    return this.questionService.find(page, limit, withDeleted);
  }

  @Roles(ROLE.Teacher, ROLE.USER)
  @ApiOkResponse({ type: Question, isArray: true })
  @Get('course/:courseId')
  async findMine(
    @GetUser() user: User,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Question[]> {
    const course = await this.coursesService.findOne(courseId);
    if (!course) throw new ForbiddenException("this course isn't found");
    switch (user.role.name) {
      case 'user': {
        const aplly = await this.applyService.checkApply(courseId, user.id);
        if (!aplly)
          throw new ForbiddenException("you don't aplly at this course");
        break;
      }
      case 'teacher': {
        if (course.teacherId != user.id)
          throw new ForbiddenException("you don't owner this course");
        break;
      }
    }
    return this.questionService.findForCourse(courseId);
  }

  // @SerializeOptions({ groups: [GROUPS.CAR] })
  @Roles(ROLE.Teacher)
  @ApiCreatedResponse({ type: Question })
  @Post()
  async create(
    @Body() dto: CreateQuestionDto,
    @GetUser() teacher: Teacher,
    @Param('courseId') courseId: string,
  ): Promise<Question> {
    const course = await this.coursesService.checkOwner(teacher.id, courseId);
    return await this.questionService.create(course, dto);
  }

  @ApiOkResponse({ type: Question })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.findOne(id);
  }

  @ApiOkResponse({ type: Question })
  @Roles(ROLE.Teacher)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') teacherId: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, dto, teacherId);
  }

  @ApiNoContentResponse()
  @Roles(ROLE.Teacher)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') teacherId: string,
  ) {
    return this.questionService.remove(id, teacherId);
  }
}
