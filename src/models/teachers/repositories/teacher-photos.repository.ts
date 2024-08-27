import { Injectable } from '@nestjs/common';
import { TeacherPhoto, Teacher } from '..';
import { Repository } from 'typeorm';
import { createBlurHash } from '../../../common/helpers';
import { CloudinaryService } from '../../../shared/cloudinary';
import { InjectRepository } from '@nestjs/typeorm';
import { IPhoto } from '../../../common/interfaces';

@Injectable()
export class TeacherPhotosRepository {
  constructor(
    @InjectRepository(TeacherPhoto)
    private readonly teacherPhotoPhotoRepo: Repository<TeacherPhoto>,
    private cloudinaryService: CloudinaryService,
  ) {}
  create(params: IPhoto) {
    return this.teacherPhotoPhotoRepo.create(params);
  }

  async findPhotosByUser(teacherId: string) {
    return this.teacherPhotoPhotoRepo.find({ where: { teacherId } });
  }

  async uploadPhoto(path: string) {
    if (!path) return;
    const blurHash = await createBlurHash(path);
    const uploaded = await this.cloudinaryService.uploadSinglePhoto(blurHash);
    const photo = this.teacherPhotoPhotoRepo.create(uploaded);
    return photo;
  }
}
