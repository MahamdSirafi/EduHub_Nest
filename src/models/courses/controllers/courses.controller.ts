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

import { CreateCourseDto, UpdateCourseDto } from '../dtos';
import { Course } from '../entities/course.entity';
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
import { CourseService } from '../services/courser.service';
import { Teacher } from '../../teachers';

@ApiTags('courses')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@UseInterceptors(new LoggingInterceptor())
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'courses', version: '1' })
export class CourseController implements ICrud<Course> {
  constructor(private coursesService: CourseService) {}

  @UseInterceptors(WithDeletedInterceptor)
  @ApiOkResponse({ type: PaginatedResponse<Course> })
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
    return this.coursesService.find(page, limit, withDeleted);
  }

  @Roles(ROLE.Teacher)
  @ApiOkResponse({ type: Course, isArray: true })
  @Get('mine')
  async findMine(@GetUser('id') teacherId: string): Promise<Course[]> {
    return this.coursesService.findMyCourses(teacherId);
  }

  @Roles(ROLE.Teacher)
  @ApiCreatedResponse({ type: Course })
  @Post()
  async create(
    @Body() createCarDto: CreateCourseDto,
    @GetUser() teacher: Teacher,
  ): Promise<Course> {
    return await this.coursesService.create(teacher, createCarDto);
  }

  @ApiOkResponse({ type: Course })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  @ApiOkResponse({ type: Course })
  @Roles(ROLE.Teacher)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, dto);
  }

  @ApiNoContentResponse()
  @Roles(ROLE.Teacher)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.remove(id);
  }
}
