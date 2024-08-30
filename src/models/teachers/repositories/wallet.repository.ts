import { Repository } from 'typeorm';
import { TeacherWallet } from '../entities/wallet.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IWalletTeacherRepository } from '../interfaces/repositories/wallet.repository.interface';

@Injectable()
export class WalleTRepository implements IWalletTeacherRepository {
  constructor(
    @InjectRepository(TeacherWallet)
    private readonly walletRepo: Repository<TeacherWallet>,
  ) {}
  create(): TeacherWallet {
    return this.walletRepo.create();
  }

  async deposit(id: string, cost: number): Promise<TeacherWallet> {
    const result = await this.walletRepo
      .createQueryBuilder()
      .update(TeacherWallet)
      .set({ total: () => 'total + :cost' })
      .where('teacgerId = :id', { id, cost })
      .returning('*')
      .execute();

    const updatedWallet = result.raw[0];
    if (!updatedWallet) {
      throw new NotFoundException('Wallet not found');
    }
    return updatedWallet;
  }

  async withdraw(id: string, cost: number): Promise<TeacherWallet> {
    const valid = await this.walletRepo.findOne({ where: { teacherId: id } });
    if (valid.total < cost) throw new Error('Teacher dose not have this cost');
    const result = await this.walletRepo
      .createQueryBuilder()
      .update(TeacherWallet)
      .set({ total: () => 'total - :cost' })
      .where('driverId = :id', { id, cost })
      .returning('*')
      .execute();

    const updatedWallet = result.raw[0];
    if (!updatedWallet) {
      throw new NotFoundException('Wallet not found');
    }
    return updatedWallet;
  }
}
