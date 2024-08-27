import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateVideoDto, UpdateVideoDto, Video } from '..';
import { pagination } from '../../../common/helpers';
import { PaginatedResponse } from '../../../common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAuthRepo } from '../../../common/entities';
import { Course } from '../../courses/entities/course.entity';

@Injectable()
export class VideoRepository extends BaseAuthRepo<Video> {
  constructor(
    @InjectRepository(Video)
    private readonly VideoRepo: Repository<Video>,
  ) {
    super(VideoRepo);
  }

  async findForCourse(courseId: string): Promise<Video[]> {
    // console.log(courseId);
    return this.VideoRepo.find({
      where: { courseId: courseId },
    });
  }

  async create(course: Course, dto: CreateVideoDto): Promise<Video> {
    const video = new Video();
    video.video = dto.video;
    video.course = course;
    video.titel = dto.titel;
    video.description = dto.description;
    video.level = dto.level;
    return this.VideoRepo.save(video);
  }

  async find(
    page: number,
    limit: number,
    withDeleted: boolean,
  ): Promise<PaginatedResponse<Video>> {
    const skip = (page - 1) * limit || 0;
    const take = limit || 100;
    const data = await this.VideoRepo.find({
      skip,
      take,
      withDeleted,
      relations: { course: true },
    });
    const totalDataCount = await this.VideoRepo.count({ withDeleted });
    return pagination(page, limit, totalDataCount, data);
  }

  async findOneById(id: string, withDeleted = false): Promise<Video> {
    return await this.VideoRepo.findOne({
      where: { id },
      withDeleted,
      relations: { course: true },
    });
  }

  async update(video: Video, dto: UpdateVideoDto): Promise<Video> {
    Object.assign(video, {
      titel: dto.titel,
      description: dto.description,
      level: dto.level,
      video: dto.video,
    });
    await this.VideoRepo.save(video);
    return this.findOneById(video.id);
  }

  async remove(course: Video): Promise<void> {
    this.VideoRepo.softRemove(course);
  }
}
