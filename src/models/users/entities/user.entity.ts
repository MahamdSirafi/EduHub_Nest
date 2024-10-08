import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BasePerson, BasePhoto } from '../../../common/entities';
import { Exclude, Expose, Transform } from 'class-transformer';
import { GROUPS } from '../../../common/enums';
import { Role } from '../../roles';
import { UserPhoto } from './user-photo.entity';
import * as crypto from 'crypto';
import { ApiProperty } from '@nestjs/swagger';
import { UserWallet } from './wallet.entity';
import { Apply } from '../../applies';

@Entity({ name: 'users' })
export class User extends BasePerson {
  @Expose({ groups: [GROUPS.USER] })
  @Transform(({ value }) => value.name)
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Exclude()
  @Column()
  roleId: string;

  @ApiProperty({ type: UserWallet })
  @Expose({ groups: [GROUPS.USER] })
  @OneToOne(() => UserWallet, (wallet) => wallet.user, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  wallet: UserWallet;

  @Exclude()
  @OneToMany(() => Apply, (apply) => apply.user, {
    cascade: true,
    eager: true,
  })
  applies: Apply[];

  @Exclude()
  @OneToMany(() => UserPhoto, (userPhoto) => userPhoto.user, {
    cascade: true,
    eager: true,
  })
  photos: UserPhoto[];

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
