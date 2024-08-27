import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTeacherDto } from '../dtos';
import { Teacher } from '../entities/teacher.entity';
import { Entities } from '../../../common/enums';
import { item_not_found } from '../../../common/constants';
import { ITeachersService } from '../interfaces/services/teacher.service.interface';
import { PaginatedResponse } from '../../../common/types';
import { TeacherPhoto } from '../entities/teacher-photo.entity';
import { ITeacherRepository } from '../interfaces/repositories/teacher.repository.interface';
import { Teacher_TYPES } from '../interfaces/type';

@Injectable()
export class TeachersService implements ITeachersService {
  constructor(
    @Inject(Teacher_TYPES.repository.teacher)
    private teacherRepository: ITeacherRepository,
  ) {}

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<Teacher> | Teacher[]> {
    return this.teacherRepository.find(page, limit, withDeleted);
  }

  async findOne(id: string, withDeleted = false): Promise<Teacher> {
    const user = await this.teacherRepository.findOneById(id, withDeleted);
    if (!user) throw new NotFoundException(item_not_found(Entities.Teacher));
    return user;
  }

  async updateMe(dto: UpdateTeacherDto, teacher: Teacher): Promise<Teacher> {
    const updateUser = await this.teacherRepository.update(teacher, dto);
    return updateUser;
  }

  async deleteMe(teacher: Teacher): Promise<void> {
    await this.teacherRepository.remove(teacher);
  }
  async getMyPhotos(teacher: Teacher): Promise<TeacherPhoto[]> {
    return this.teacherRepository.getMyPhotos(teacher.id);
  }

  async update(id: string, dto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findOne(id);
    const updateUser = await this.teacherRepository.update(teacher, dto);
    return updateUser;
  }

  async recover(id: string): Promise<Teacher> {
    const teacher = await this.findOne(id, true);
    if (!teacher) throw new NotFoundException(item_not_found(Entities.Teacher));
    await this.teacherRepository.recover(teacher);
    return teacher;
  }

  async remove(id: string): Promise<void> {
    const teacher = await this.findOne(id);
    await this.teacherRepository.remove(teacher);
    return;
  }
}
