import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Entities, ROLE } from '../../common/enums';
import { JwtTokenService } from '../../shared/jwt';
import {
  SignUpDto,
  PasswordChangeDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dtos';
import { AuthTeacherResponse, jwtPayload } from '../interfaces';
import { Admin } from '../../models/admins';

import { IAuthController } from '../../common/interfaces';
import * as crypto from 'crypto';
import {
  item_not_found,
  incorrect_current_password,
  incorrect_credentials,
  reset_token_message,
  reset_token_expired,
  password_changed_recently,
} from '../../common/constants';
import { IAdminRepository } from '../../models/admins/interfaces/repositories/admin.repository.interface';
import { ADMIN_TYPES } from '../../models/admins/interfaces/type';
import { ROLE_TYPES } from '../../models/roles/interfaces/type';
import { IRoleRepository } from '../../models/roles/interfaces/repositories/role.repository.interface';
import { ITeacherRepository } from '../../models/teachers/interfaces/repositories/teacher.repository.interface';
import { Teacher } from '../../models/teachers';
import { Teacher_TYPES } from '../../models/teachers/interfaces/type';
import { User } from '../../models/users';
import { IUserRepository } from '../../models/users/interfaces/repositories/user.repository.interface';
import { USER_TYPES } from '../../models/users/interfaces/type';

@Injectable()
export class AuthService implements IAuthController<AuthTeacherResponse> {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    @Inject(Teacher_TYPES.repository.teacher)
    private readonly teatcherRepository: ITeacherRepository,
    @Inject(USER_TYPES.repository.user)
    private readonly userRepository: IUserRepository,
    @Inject(ADMIN_TYPES.repository.admin)
    private readonly adminRepository: IAdminRepository,
    @Inject(ROLE_TYPES.repository)
    private readonly roleRepository: IRoleRepository,
  ) {}
  async signup(dto: SignUpDto): Promise<AuthTeacherResponse> {
    const role = await this.roleRepository.findByName(ROLE.Teacher);
    const teacher = await this.teatcherRepository.create(dto, role);
    return this.sendAuthResponse(teacher);
  }

  async login(dto: LoginDto): Promise<AuthTeacherResponse> {
    const teacher = await this.teatcherRepository.findOneByEmail(dto.email);
    if (
      !teacher ||
      !(await teacher.verifyHash(teacher.password, dto.password))
    ) {
      throw new UnauthorizedException(incorrect_credentials);
    }
    return this.sendAuthResponse(teacher);
  }

  async updateMyPassword(dto: PasswordChangeDto, email: string) {
    const teacher = await this.teatcherRepository.findOneByEmail(email);

    if (!Teacher) throw new NotFoundException(item_not_found(Entities.Teacher));

    // 2)check if the passwordConfirm is correct
    if (!(await teacher.verifyHash(teacher.password, dto.passwordCurrent))) {
      throw new UnauthorizedException(incorrect_current_password);
    }
    await this.teatcherRepository.resetPassword(teacher, dto);
    const token = await this.jwtTokenService.signToken(
      teacher.id,
      Teacher.name,
    );

    return { token, teacher };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.teatcherRepository.findOneByEmail(dto.email);
    await user.save();
    return { message: reset_token_message };
  }

  async resetPassword(
    dto: ResetPasswordDto,
    dynamicOrigin: string,
  ): Promise<AuthTeacherResponse> {
    const hashToken = crypto
      .createHash('sha256')
      .update(dto.resetToken)
      .digest('hex');
    let user = await this.teatcherRepository.findOneByResetToken(hashToken);
    if (!user) {
      throw new NotFoundException(reset_token_expired);
    }
    user = await this.teatcherRepository.resetPassword(user, dto);
    return this.sendAuthResponse(user);
  }

  async sendAuthResponse(teacher: Teacher): Promise<AuthTeacherResponse> {
    const token = await this.jwtTokenService.signToken(
      teacher.id,
      Teacher.name,
    );
    return { token, teacher };
  }

  async validate(payload: jwtPayload) {
    let teacher: Teacher | Admin | User;

    if (payload.entity === Admin.name) {
      teacher = await this.adminRepository.validate(payload.sub);
    } else if (payload.entity === Teacher.name) {
      teacher = await this.teatcherRepository.validate(payload.sub);
    } else if (payload.entity === User.name) {
      teacher = await this.userRepository.validate(payload.sub);
    }

    if (!teacher) {
      throw new UnauthorizedException('The teacher is not here');
    }

    if (teacher.isPasswordChanged(payload.iat)) {
      throw new UnauthorizedException(password_changed_recently);
    }
    return teacher;
  }
}
