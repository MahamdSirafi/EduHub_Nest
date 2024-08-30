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
  NotFoundException,
  InternalServerErrorException,
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
import { Apply } from '../entities/apply.entity';
import { GetUser, Roles } from '../../../common/decorators';
import { ROLE } from '../../../common/enums';
import { CaslAbilitiesGuard, RolesGuard } from '../../../common/guards';
import {
  LoggingInterceptor,
  WithDeletedInterceptor,
} from '../../../common/interceptors';
import { PaginatedResponse } from '../../../common/types';
import {
  bad_req,
  data_not_found,
  denied_error,
} from '../../../common/constants';
import { Request } from 'express';
import { ApplyService } from '../services/apply.service';
import { CourseService } from '../../courses/services/courser.service';
import {
  CreateApplyDto,
  RatingApplyDto,
  ResultApplyDto,
} from '../dtos/apply.dto';
import { User } from '../../users';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { WalleTRepository } from '../../teachers/repositories/wallet.repository';
import { WalletRepository } from '../../users/repositories/wallet.repository';

@ApiTags('applies')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@UseInterceptors(new LoggingInterceptor())
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'applies', version: '1' })
export class ApplyController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly userWalletRepository: WalletRepository,
    private readonly teacherWalletRepository: WalleTRepository,
    private applyService: ApplyService,
    private coursesService: CourseService,
  ) {}
  @Roles(ROLE.SUPER_ADMIN)
  @UseInterceptors(WithDeletedInterceptor)
  @ApiOkResponse({ type: PaginatedResponse<Apply> })
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
    return this.applyService.find(page, limit, withDeleted);
  }

  @Roles(ROLE.Teacher)
  @ApiOkResponse({ type: Apply, isArray: true })
  @Get('course/:courseId')
  async findMine(
    @GetUser('id') teacherId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<Apply[]> {
    console.log(courseId);
    return this.applyService.findForCourse(courseId);
  }

  @Roles(ROLE.USER)
  @ApiOkResponse({ type: Apply, isArray: true })
  @Get('forUser')
  async findMineApply(@GetUser('id') userId: string): Promise<Apply[]> {
    return this.applyService.findForUser(userId);
  }

  @Roles(ROLE.USER)
  @ApiCreatedResponse({ type: Apply })
  @Post()
  async create(
    @Body() dto: CreateApplyDto,
    @GetUser() user: User,
  ): Promise<Apply> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const course = await this.coursesService.findOne(dto.courseId);
      if (!course) throw new NotFoundException('course is not found');

      await this.userWalletRepository.withdraw(user.id, course.price);
      await this.teacherWalletRepository.deposit(
        course.teacherId,
        course.price,
      );
      const aplly = await this.applyService.create(user, course, dto);
      await queryRunner.commitTransaction();
      return aplly;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to set delivered at: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  @ApiOkResponse({ type: Apply })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.applyService.findOne(id);
  }

  @ApiOkResponse({ type: Apply })
  @Roles(ROLE.USER)
  @Patch(':id/rating')
  async rating(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') userId: string,
    @Body() dto: RatingApplyDto,
  ) {
    return this.applyService.rating(id, dto, userId);
  }

  @ApiOkResponse({ type: Apply })
  @Roles(ROLE.USER)
  @Patch(':id/setResult')
  async setResult(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') userId: string,
    @Body() dto: ResultApplyDto,
  ) {
    return this.applyService.setResult(id, dto, userId);
  }

  @ApiNoContentResponse()
  @Roles(ROLE.Teacher)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') teacherId: string,
  ) {
    return this.applyService.remove(id, teacherId);
  }
}
