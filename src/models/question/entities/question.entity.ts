import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GlobalEntity } from '../../../common/entities';
import { Course } from '../../courses';

@Entity({ name: 'questions' })
export class Question extends GlobalEntity {
  @ManyToOne(() => Course, (course) => course.questions)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Exclude()
  @Column()
  courseId: string;

  @ApiProperty()
  @Column()
  question: string;

  @ApiProperty()
  @Column()
  A: string;

  @ApiProperty()
  @Column()
  B: string;

  @ApiProperty()
  @Column()
  C: string;

  @ApiProperty()
  @Column()
  D: string;

  @ApiProperty()
  @Column()
  answer: string;
}
