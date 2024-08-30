import { Repository } from 'typeorm';
import { UserWallet } from '../entities/wallet.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IWalletRepository } from '../interfaces/repositories/wallet.repository.interface';

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @InjectRepository(UserWallet)
    private readonly walletRepo: Repository<UserWallet>,
  ) {}
  create(): UserWallet {
    return this.walletRepo.create();
  }

  async check(userId: string, cost: number): Promise<boolean> {
    const user = await this.walletRepo.findOne({ where: { userId } });
    return user.available() < cost ? false : true;
  }
  async deposit(id: string, cost: number): Promise<UserWallet> {
    const result = await this.walletRepo
      .createQueryBuilder()
      .update(UserWallet)
      .set({ total: () => 'total + :cost' })
      .where('userId = :id', { id, cost })
      .returning('*')
      .execute();
    const updatedWallet = result.raw[0];
    if (!updatedWallet) {
      throw new NotFoundException('Wallet not found');
    }
    return updatedWallet;
  }
  async withdraw(id: string, cost: number): Promise<UserWallet> {
    const valid = await this.walletRepo.findOne({ where: { userId: id } });
    if (valid.total < cost) throw new Error('user dose not have this cost');
    const result = await this.walletRepo
      .createQueryBuilder()
      .update(UserWallet)
      .set({ total: () => 'total - :cost' })
      .where('userId = :id')
      .setParameters({ id, cost })
      .returning('*')
      .execute();
    const updatedWallet = result.raw[0];
    if (!updatedWallet) {
      throw new NotFoundException('Wallet not found');
    }
    return updatedWallet;
  }
}
