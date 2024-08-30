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

import { UpdateUserDto, UpdateWalletDto } from '../dtos';
import { User } from '../entities/user.entity';
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
import { IUsersService } from '../interfaces/services/users.service.interface';
import { USER_TYPES } from '../interfaces/type';
import { WalletRepository } from '../repositories/wallet.repository';

@ApiTags('users')
@ApiBearerAuth('token')
@ApiBadRequestResponse({ description: bad_req })
@ApiForbiddenResponse({ description: denied_error })
@ApiNotFoundResponse({ description: data_not_found })
@UseInterceptors(new LoggingInterceptor())
@UseGuards(CaslAbilitiesGuard, RolesGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController implements ICrud<User> {
  constructor(
    @Inject(USER_TYPES.service) private usersService: IUsersService,
    private walletRepository: WalletRepository,
  ) {}

  @UseInterceptors(WithDeletedInterceptor)
  @SerializeOptions({ groups: [GROUPS.ALL_USERS] })
  @ApiOkResponse({ type: PaginatedResponse<User> })
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
    return this.usersService.find(page, limit, withDeleted);
  }

  @ApiOkResponse({ type: User })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @Roles(ROLE.USER)
  @Get('myPhotos')
  async getMyPhotos(@GetUser() user: User) {
    return this.usersService.getMyPhotos(user);
  }
  create(...n: any[]): Promise<User> {
    return;
  }

  @ApiOkResponse({ type: User })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @Roles(ROLE.USER)
  @Get('me')
  async getMe(@GetUser() user: User) {
    return user;
  }

  @ApiOkResponse({ type: User })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @Roles(ROLE.USER)
  @Patch('me')
  async updateMe(@Body() dto: UpdateUserDto, @GetUser() user: User) {
    return this.usersService.updateMe(dto, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @SerializeOptions({ groups: [GROUPS.USER] })
  @Roles(ROLE.USER)
  @Delete('me')
  async deleteMe(@GetUser() user: User) {
    return this.usersService.deleteMe(user);
  }

  @ApiOkResponse({ type: User })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOkResponse({ type: User })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @CheckAbilities({ action: Action.Update, subject: Entities.User })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @ApiNoContentResponse()
  @CheckAbilities({ action: Action.Delete, subject: Entities.User })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @ApiOperation({ summary: 'recover deleted user' })
  @CheckAbilities({ action: Action.Update, subject: Entities.User })
  @HttpCode(HttpStatus.OK)
  @Post(':id/recover')
  async recover(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.recover(id);
  }
  
  @Roles(ROLE.ADMIN)
  @ApiOkResponse({ type: User })
  @Patch(':id/wallet/withdraw')
  async withdraw(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.walletRepository.withdraw(id, dto.cost);
  }
  @Roles(ROLE.ADMIN)
  @ApiOkResponse({ type: User })
  @Patch(':id/wallet/deposit')
  async deposit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWalletDto,
  ) {
    return this.walletRepository.deposit(id, dto.cost);
  }
}
