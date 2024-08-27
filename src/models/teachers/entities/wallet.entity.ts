import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { GlobalEntity } from '../../../common/entities';
import { Teacher } from './teacher.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Entity('teachers_wallets')
export class Wallet extends GlobalEntity {
  @OneToOne(() => Teacher, (teacher) => teacher.wallet)
  @JoinColumn({ name: 'teacherId', referencedColumnName: 'id' })
  teacher: Teacher;

  @Exclude()
  @Column('uuid')
  teacherId: string;

  @ApiProperty({ default: 0 })
  @Column({ type: 'int', default: 0 })
  total: number;

  @ApiProperty({ default: 0 })
  @Column({ type: 'int', default: 0 })
  pending: number;

  @ApiProperty({ default: 0 })
  @Expose()
  available() {
    return this.total - this.pending;
  }
}
