import { Module } from '@nestjs/common';
import { VideoRepository } from './repositories/video.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { VideoController } from './controllers/videos.controller';
import { VideoService } from './services/video.service';
import { CoursesModule } from '../courses/course.module';
import { ApplyModule } from '../applies/apply.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), CoursesModule, ApplyModule],
  controllers: [VideoController],
  providers: [VideoRepository, VideoService],
  exports: [VideoRepository, VideoService],
})
export class VideoModule {}
