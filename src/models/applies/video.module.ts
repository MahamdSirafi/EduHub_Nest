import { Module } from '@nestjs/common';
import { VideoRepository } from './repositories/video.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/apply.entity';
import { VideoController } from './controllers/apply.controller';
import { VideoService } from './services/video.service';
import { CoursesModule } from '../courses/course.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), CoursesModule],
  controllers: [VideoController],
  providers: [VideoRepository, VideoService],
  exports: [VideoRepository, VideoService],
})
export class VideoModule {}
