import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GlobalEntity } from '../../../common/entities';
import { Course } from '../../courses';

@Entity({ name: 'videos' })
export class Video extends GlobalEntity {
  @ManyToOne(() => Course, (course) => course.videos)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Exclude()
  @Column()
  courseId: string;

  @ApiProperty()
  @Column()
  video: string;

  @ApiProperty()
  @Column()
  titel: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  level: string;
}
