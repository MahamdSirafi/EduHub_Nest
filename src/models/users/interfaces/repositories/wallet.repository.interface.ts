import { UserWallet } from '../../entities/wallet.entity';

export interface IWalletRepository {
  create(): UserWallet;
  deposit(id: string, cost: number): Promise<UserWallet>;
}
