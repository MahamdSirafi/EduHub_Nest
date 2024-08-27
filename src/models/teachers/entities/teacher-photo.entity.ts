import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Teacher } from './teacher.entity';
import { BasePhoto } from '../../../common/entities';
import { Exclude } from 'class-transformer';

@Entity({ name: 'teachers_photos' })
export class TeacherPhoto extends BasePhoto {
  @ManyToOne(() => Teacher, (teacher) => teacher.photos)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @Exclude()
  @Column()
  teacherId: string;
}
