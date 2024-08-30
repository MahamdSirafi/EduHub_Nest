import { Module } from '@nestjs/common';
import { ApplyRepository } from './repositories/apply.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apply } from './entities/apply.entity';
import { ApplyController } from './controllers/apply.controller';
import { ApplyService } from './services/apply.service';
import { CoursesModule } from '../courses/course.module';
import { UsersModule } from '../users/users.module';
import { TeachersModule } from '../teachers/teacher.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Apply]),
    CoursesModule,
    UsersModule,
    TeachersModule,
  ],
  controllers: [ApplyController],
  providers: [ApplyRepository, ApplyService],
  exports: [ApplyRepository, ApplyService],
})
export class ApplyModule {}
