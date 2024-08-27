import {
  Controller,
  SerializeOptions,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public, GetUser, Roles } from '../../common/decorators';
import { GROUPS, ROLE } from '../../common/enums';
import { AuthService } from '../services/auth.service';
import {
  SignUpDto,
  PasswordChangeDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dtos';
import { RolesGuard } from '../../common/guards';
import { IAuthController } from '../../common/interfaces';
import { AuthTeacherResponse } from '../interfaces';
import { Request } from 'express';

/**
 * @ngdoc controller
 * @name AuthController
 *
 * @description
 * My controller description.
 */
@ApiTags('auth teacher')
@ApiBearerAuth('token')
@Controller({ path: 'auth_teacher', version: '1' })
export class AuthController implements IAuthController<AuthTeacherResponse> {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiCreatedResponse({ type: AuthTeacherResponse })
  @Post('signup')
  signup(@Body() dto: SignUpDto, @Req() request: Request) {
    const dynamicOrigin = `${request.protocol}://${request.get('host')}`;
    return this.authService.signup(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'Teacher logged in successfully',
    type: AuthTeacherResponse,
  })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiOkResponse({
    description: 'send reset password email if you forgot password',
    schema: {
      example: { message: 'تم ارسال رمز اعادة التعيين لبريدك الالكتروني' },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('forgotPassword')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Reset Password' })
  @ApiOkResponse({
    description: 'Your account password has been reset',
    type: AuthTeacherResponse,
  })
  @SerializeOptions({ groups: [GROUPS.USER] })
  @HttpCode(HttpStatus.OK)
  @Post('resetPassword')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() request: Request,
  ): Promise<AuthTeacherResponse> {
    const dynamicOrigin = `${request.protocol}://${request.get('host')}`;

    return this.authService.resetPassword(dto, dynamicOrigin);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE.Teacher)
  @Patch('updateMyPassword')
  updateMyPassword(
    @Body() dto: PasswordChangeDto,
    @GetUser('email') email: string,
  ) {
    return this.authService.updateMyPassword(dto, email);
  }
}
