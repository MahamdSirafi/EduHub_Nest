import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BasePerson, BasePhoto } from '../../../common/entities';
import { Exclude, Expose, Transform } from 'class-transformer';
import { GROUPS } from '../../../common/enums';
import { Role } from '../../roles';
import { TeacherPhoto } from './teacher-photo.entity';
import * as crypto from 'crypto';
import { ApiProperty } from '@nestjs/swagger';
import { TeacherWallet } from './wallet.entity';
import { Course } from '../../courses';

@Entity({ name: 'teachers' })
export class Teacher extends BasePerson {
  @Transform(({ value }) => value.name)
  @ManyToOne(() => Role, (role) => role.teachers)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Exclude()
  @Column()
  roleId: string;

  @ApiProperty({ type: TeacherWallet })
  @OneToOne(() => TeacherWallet, (wallet) => wallet.teacher, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  wallet: TeacherWallet;

  @Exclude()
  @OneToMany(() => Course, (course) => course.teacher, {
    cascade: true,
    eager: true,
  })
  courses: Course[];

  @Exclude()
  @OneToMany(() => TeacherPhoto, (teacherPhoto) => teacherPhoto.teacher, {
    cascade: true,
    eager: true,
  })
  photos: TeacherPhoto[];

  @Expose({})
  @ApiProperty({ type: BasePhoto })
  photo() {
    if (this.photos) return this.photos[this.photos.length - 1];
    return undefined;
  }

  createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
  }
}
