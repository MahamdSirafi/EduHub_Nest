import {
  UseGuards,
  UseInterceptors,
  Controller,
  SerializeOptions,
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
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { CreateVideoDto, UpdateVideoDto } from '../dtos';
import { Video } from '../entities/video.entity';
import { GetUser, Roles, CheckAbilities } from '../../../common/decorators';
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
import { VideoService } from '../services/video.service';
import { CourseService } from '../../courses/services/courser.service';
import { Teacher } from '../../teachers';
import { UUID } from 'crypto';

@ApiTags('videos')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@UseInterceptors(new LoggingInterceptor())
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'videos', version: '1' })
export class VideoController implements ICrud<Video> {
  constructor(
    private videosService: VideoService,
    private coursesService: CourseService,
  ) {}
  @Roles(ROLE.SUPER_ADMIN)
  @UseInterceptors(WithDeletedInterceptor)
  @ApiOkResponse({ type: PaginatedResponse<Video> })
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
    return this.videosService.find(page, limit, withDeleted);
  }

  // @SerializeOptions({ groups: [GROUPS.ALL_CARS] })
  @Roles(ROLE.Teacher)
  @ApiOkResponse({ type: Video, isArray: true })
  @Get('course/:courseId')
  async findMine(
    @GetUser('id') teacherId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Video[]> {
    console.log(courseId);
    return this.videosService.findForCourse(courseId);
  }

  // @SerializeOptions({ groups: [GROUPS.CAR] })
  @Roles(ROLE.Teacher)
  @ApiCreatedResponse({ type: Video })
  @Post()
  async create(
    @Body() dto: CreateVideoDto,
    @GetUser() teacher: Teacher,
    @Param('courseId') courseId: string,
  ): Promise<Video> {
    const course = await this.coursesService.checkOwner(teacher.id, courseId);
    return await this.videosService.create(course, dto);
  }

  @ApiOkResponse({ type: Video })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.videosService.findOne(id);
  }

  @ApiOkResponse({ type: Video })
  @Roles(ROLE.Teacher)
  // @CheckAbilities({ action: Action.Update, subject: Entities.Teacher })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') teacherId: string,
    @Body() dto: UpdateVideoDto,
  ) {
    return this.videosService.update(id, dto, teacherId);
  }

  @ApiNoContentResponse()
  @Roles(ROLE.Teacher)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') teacherId: string,
  ) {
    return this.videosService.remove(id, teacherId);
  }
}
