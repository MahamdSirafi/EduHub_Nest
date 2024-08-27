import { ResetPasswordDto, PasswordChangeDto } from '../../../../auth';
import { PaginatedResponse } from '../../../../common/types';
import { Role } from '../../../roles';
import { CreateTeacherDto, UpdateTeacherDto } from '../../dtos';
import { TeacherPhoto } from '../../entities/teacher-photo.entity';
import { Teacher } from '../../entities/teacher.entity';

export interface ITeacherRepository {
  find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<Teacher> | Teacher[]>;

  findOneById(id: string, withDeleted: boolean): Promise<Teacher>;

  findOneByEmail(email: string, withDeleted?: boolean): Promise<Teacher>;

  findOneByIdForThings(id: string): Promise<Teacher>;

  findOneByResetToken(hashToken: string): Promise<Teacher>;

  create(dto: CreateTeacherDto, role: Role): Promise<Teacher>;

  update(teacher: Teacher, dto: UpdateTeacherDto): Promise<Teacher>;

  resetPassword(
    teacher: Teacher,
    dto: ResetPasswordDto | PasswordChangeDto,
  ): Promise<Teacher>;

  getMyPhotos(userId: string): Promise<TeacherPhoto[]>;

  recover(teacher: Teacher): Promise<Teacher>;

  remove(teacher: Teacher): Promise<void>;

  validate(id: string): Promise<Teacher>;
}
