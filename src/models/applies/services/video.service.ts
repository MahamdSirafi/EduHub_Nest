import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVideoDto, UpdateVideoDto } from '../dtos';
import { Video } from '../entities/apply.entity';
import { Entities } from '../../../common/enums';
import { item_not_found } from '../../../common/constants';
import { PaginatedResponse } from '../../../common/types';
import { VideoRepository } from '../repositories/video.repository';
import { Course } from '../../courses';

@Injectable()
export class VideoService {
  constructor(private VideoRepo: VideoRepository) {}

  async create(course: Course, dto: CreateVideoDto): Promise<Video> {
    if (!course) throw new ForbiddenException('Can not create a video');
    return this.VideoRepo.create(course, dto);
  }

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<Video> | Video[]> {
    return this.VideoRepo.find(page, limit, withDeleted);
  }

  async findForCourse(courseId: string): Promise<Video[]> {
    return this.VideoRepo.findForCourse(courseId);
  }

  async findOne(id: string): Promise<Video> {
    const video = await this.VideoRepo.findOneById(id);
    if (!video) throw new NotFoundException(item_not_found(Entities.Video));
    return video;
  }

  async update(
    id: string,
    dto: UpdateVideoDto,
    teacherId: string,
  ): Promise<Video> {
    const video = await this.findOne(id);
    if (video.course.teacherId !== teacherId)
      throw new ForbiddenException('Can not update this video');
    return await this.VideoRepo.update(video, dto);
  }

  async remove(id: string, teacherId: string): Promise<void> {
    const video = await this.findOne(id);
    if (video.course.teacherId !== teacherId)
      throw new ForbiddenException('Can not delete this video');
    await this.VideoRepo.remove(video);
    return;
  }
}
