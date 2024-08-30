import { TeacherWallet } from '../../entities/wallet.entity';

export interface IWalletTeacherRepository {
  create(): TeacherWallet;
  deposit(id: string, cost: number): Promise<TeacherWallet>;
  withdraw(id: string, cost: number): Promise<TeacherWallet>;
}
