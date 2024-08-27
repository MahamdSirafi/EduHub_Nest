import { Role } from '../../roles';
import { Inject, Injectable } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { CreateTeacherDto, UpdateTeacherDto, Teacher, TeacherPhoto } from '..';
import { defaultPhoto } from '../../../common/constants';
import { pagination } from '../../../common/helpers';
import { PasswordChangeDto, ResetPasswordDto } from '../../../auth';
import { PaginatedResponse } from '../../../common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { ITeacherRepository } from '../interfaces/repositories/teacher.repository.interface';
import { ITeacherPhotosRepository } from '../interfaces/repositories/teacher-photos.repository.interface';
import { Teacher_TYPES } from '../interfaces/type';
import { IWalletRepository } from '../interfaces/repositories/wallet.repository.interface';
import { BaseAuthRepo } from '../../../common/entities';

@Injectable()
export class TeacherRepository
  extends BaseAuthRepo<Teacher>
  implements ITeacherRepository
{
  constructor(
    @InjectRepository(Teacher) private readonly teacherRepo: Repository<Teacher>,
    @Inject(Teacher_TYPES.repository.teacher_photos)
    private readonly teacherPhotosRepository: ITeacherPhotosRepository,
    @Inject(Teacher_TYPES.repository.wallet)
    private readonly walletRepository: IWalletRepository,
  ) {
    super(teacherRepo);
  }

  async create(dto: CreateTeacherDto, role: Role): Promise<Teacher> {
    const wallet = this.walletRepository.create();
    const user = this.teacherRepo.create({ ...dto, role, wallet, photos: [] });
    user.photos.push(this.teacherPhotosRepository.create(defaultPhoto));
    await user.save();
    return user;
  }

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<Teacher>> {
    const skip = (page - 1) * limit || 0;
    const take = limit || 100;
    const data = await this.teacherRepo.find({
      relations: { photos: true, role: true },
      skip,
      take,
      withDeleted,
    });
    const totalDataCount = await this.teacherRepo.count({ withDeleted });
    return pagination(page, limit, totalDataCount, data);
  }

  async findOneById(id: string, withDeleted = false): Promise<Teacher> {
    return await this.teacherRepo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        wallet: { id: true, total: true, pending: true },
      },
      relations: {
        role: { permissions: true },
        photos: true,
        wallet: true,
      },
      withDeleted,
    });
  }

  async findOneByResetToken(hashToken: string) {
    return this.teacherRepo.findOne({
      where: {
        passwordResetToken: hashToken,
        passwordResetExpires: MoreThan(new Date()),
      },
      select: {
        passwordChangedAt: true,
        passwordResetExpires: true,
        passwordResetToken: true,
        password: true,
        id: true,
        name: true,
      },
    });
  }
  async findOneByEmail(email: string, withDeleted = false): Promise<Teacher> {
    return await this.teacherRepo.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        wallet: { id: true, total: true, pending: true },
      },
      relations: {
        role: { permissions: true },
        photos: true,
        wallet: true,
      },
      withDeleted,
    });
  }
  async findOneByIdForThings(id: string): Promise<Teacher> {
    return await this.teacherRepo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
      },
      relations: { photos: true },
    });
  }

  async update(teacher: Teacher, dto: UpdateTeacherDto): Promise<Teacher> {
    teacher.photos.push(await this.teacherPhotosRepository.uploadPhoto(dto.photo));
    Object.assign(teacher, { email: dto.email, name: dto.name });
    await this.teacherRepo.save(teacher);
    return this.findOneById(teacher.id);
  }

  async resetPassword(
    teacher: Teacher,
    dto: ResetPasswordDto | PasswordChangeDto,
  ): Promise<Teacher> {
    teacher.password = dto.password;
    teacher.passwordResetToken = null;
    teacher.passwordResetExpires = null;
    teacher.passwordChangedAt = new Date(Date.now() - 1000);
    await this.teacherRepo.save(teacher);
    return this.findOneById(teacher.id);
  }

  async getMyPhotos(teacherId: string): Promise<TeacherPhoto[]> {
    return this.teacherPhotosRepository.findPhotosByUser(teacherId);
  }

  async recover(teacher: Teacher): Promise<Teacher> {
    return this.teacherRepo.recover(teacher);
  }
  async remove(teacher: Teacher): Promise<void> {
    this.teacherRepo.softRemove(teacher);
  }
}
