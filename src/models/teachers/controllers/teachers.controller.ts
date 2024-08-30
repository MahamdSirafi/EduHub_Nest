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
} from '@nestjs/swagger';

import { UpdateTeacherDto } from '../dtos';
import { Teacher } from '../entities/teacher.entity';
import { GetUser, Roles, CheckAbilities } from '../../../common/decorators';
import { GROUPS, ROLE, Entities, Action } from '../../../common/enums';
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
import { ITeachersService } from '../interfaces/services/teacher.service.interface';
import { Teacher_TYPES } from '../interfaces/type';
import { UpdateWalletDto } from '../dtos/wallet.dto';
import { TeacherWallet } from '../entities/wallet.entity';
import { WalleTRepository } from '../repositories/wallet.repository';

@ApiTags('teachers')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@UseInterceptors(new LoggingInterceptor())
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'teachers', version: '1' })
export class UsersController implements ICrud<Teacher> {
  constructor(
    @Inject(Teacher_TYPES.service) private teachersService: ITeachersService,
    private walletRepository: WalleTRepository,
  ) {}

  @UseInterceptors(WithDeletedInterceptor)
  // @SerializeOptions({ groups: [GROUPS.ALL_USERS] })
  @ApiOkResponse({ type: PaginatedResponse<Teacher> })
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
    return this.teachersService.find(page, limit, withDeleted);
  }

  @ApiOkResponse({ type: Teacher })
  @Roles(ROLE.Teacher)
  @Get('myPhotos')
  async getMyPhotos(@GetUser() user: Teacher) {
    return this.teachersService.getMyPhotos(user);
  }
  create(...n: any[]): Promise<Teacher> {
    return;
  }

  @ApiOkResponse({ type: Teacher })
  // @SerializeOptions({ groups: [GROUPS.Teacher] })
  @Roles(ROLE.Teacher)
  @Get('me')
  async getMe(@GetUser() user: Teacher) {
    return user;
  }

  @ApiOkResponse({ type: Teacher })
  // @SerializeOptions({ groups: [GROUPS.USER] })
  @Roles(ROLE.USER)
  @Patch('me')
  async updateMe(@Body() dto: UpdateTeacherDto, @GetUser() user: Teacher) {
    return this.teachersService.updateMe(dto, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  // @SerializeOptions({ groups: [GROUPS.USER] })
  @Roles(ROLE.USER)
  @Delete('me')
  async deleteMe(@GetUser() user: Teacher) {
    return this.teachersService.deleteMe(user);
  }

  @ApiOkResponse({ type: Teacher })
  // @SerializeOptions({ groups: [GROUPS.USER] })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.teachersService.findOne(id);
  }

  @ApiOkResponse({ type: Teacher })
  // @SerializeOptions({ groups: [GROUPS.USER] })
  @CheckAbilities({ action: Action.Update, subject: Entities.Teacher })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeacherDto,
  ) {
    return this.teachersService.update(id, dto);
  }

  @ApiNoContentResponse()
  @CheckAbilities({ action: Action.Delete, subject: Entities.Teacher })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.teachersService.remove(id);
  }

  @ApiOperation({ summary: 'recover deleted Teacher' })
  @CheckAbilities({ action: Action.Update, subject: Entities.Teacher })
  // @SerializeOptions({ groups: [GROUPS.USER] })
  @HttpCode(HttpStatus.OK)
  @Post(':id/recover')
  async recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.teachersService.recover(id);
  }

  @ApiOkResponse({ type: TeacherWallet })
  @Roles(ROLE.ADMIN)
  @Patch(':id/wallet/withdraw')
  async withdraw(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.walletRepository.withdraw(id, dto.cost);
  }
}
