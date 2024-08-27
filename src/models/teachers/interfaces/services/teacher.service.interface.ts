import { PaginatedResponse } from '../../../../common/types';
import { UpdateTeacherDto } from '../../dtos';
import { TeacherPhoto } from '../../entities/teacher-photo.entity';
import { Teacher } from '../../entities/teacher.entity';

export interface ITeachersService {
  find(
    page: number,
    limit: number,
    withDeleted?: boolean,
  ): Promise<PaginatedResponse<Teacher> | Teacher[]>;

  findOne(id: string, withDeleted?: boolean): Promise<Teacher>;

  updateMe(dto: UpdateTeacherDto, teacher: Teacher): Promise<Teacher>;

  deleteMe(teacher: Teacher): Promise<void>;

  getMyPhotos(teacher: Teacher): Promise<TeacherPhoto[]>;

  update(id: string, dto: UpdateTeacherDto): Promise<Teacher>;

  remove(id: string): Promise<void>;

  recover(id: string): Promise<Teacher>;
}
