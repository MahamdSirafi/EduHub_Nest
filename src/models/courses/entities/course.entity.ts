import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from '../../teachers';
import { GlobalEntity } from '../../../common/entities';
import { Video } from '../../videos';

@Entity({ name: 'courses' })
export class Course extends GlobalEntity {
  @ManyToOne(() => Teacher, (teacher) => teacher.photos)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @Exclude()
  @Column()
  teacherId: string;

  @Exclude()
  @OneToMany(() => Video, (video) => video.course, {
    cascade: true,
    eager: true,
  })
  videos: Video[];

  @ApiProperty()
  @Column()
  photo: string;

  @ApiProperty()
  @Column()
  titel: string;

  @ApiProperty()
  @Column()
  classification: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column({ default: false })
  popular: boolean;

  @ApiProperty()
  @Column({ default: 4 })
  rating: number;
}
