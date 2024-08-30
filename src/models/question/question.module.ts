import { Module } from '@nestjs/common';
import { QuestionRepository } from './repositories/question.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { CoursesModule } from '../courses/course.module';
import { ApplyModule } from '../applies/apply.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), CoursesModule, ApplyModule],
  controllers: [QuestionController],
  providers: [QuestionRepository, QuestionService],
  exports: [QuestionRepository, QuestionService],
})
export class QuestionModule {}
