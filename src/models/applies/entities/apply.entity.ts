import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GlobalEntity } from '../../../common/entities';
import { Course } from '../../courses';
import { User } from '../../users';

@Entity({ name: 'apply' })
export class Apply extends GlobalEntity {
  @ManyToOne(() => Course, (course) => course.applies)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Exclude()
  @Column()
  courseId: string;

  @ManyToOne(() => User, (user) => user.applies)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Exclude()
  @Column()
  userId: string;

  @ApiProperty()
  @Column()
  rating: number;

  @ApiProperty()
  @Column()
  note: string;

  @ApiProperty()
  @Column()
  result: string;
}
