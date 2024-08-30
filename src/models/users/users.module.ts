import { Module, Provider } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserPhotosRepository } from './repositories/user-photos.repository';
import { WalletRepository } from './repositories/wallet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserWallet } from './entities/wallet.entity';
import { UserPhoto } from './entities/user-photo.entity';
import { Role } from '../roles/entities/role.entity';
import { RoleRepository } from '../roles/repositories/role.repository';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { USER_TYPES } from './interfaces/type';

export const UsersServiceProvider: Provider = {
  provide: USER_TYPES.service,
  useClass: UsersService,
};

export const UserRepositoryProvider: Provider = {
  provide: USER_TYPES.repository.user,
  useClass: UserRepository,
};
export const UserPhotosRepositoryProvider: Provider = {
  provide: USER_TYPES.repository.user_photos,
  useClass: UserPhotosRepository,
};

export const WalletRepositoryProvider: Provider = {
  provide: USER_TYPES.repository.wallet,
  useClass: WalletRepository,
};
@Module({
  imports: [TypeOrmModule.forFeature([User, UserWallet, UserPhoto, Role])],
  controllers: [UsersController],
  providers: [
    UserPhotosRepositoryProvider,
    UserRepositoryProvider,
    WalletRepositoryProvider,
    UsersServiceProvider,
    RoleRepository,
    WalletRepository,
  ],
  exports: [
    UserPhotosRepositoryProvider,
    UserRepositoryProvider,
    WalletRepositoryProvider,
    UsersServiceProvider,
    WalletRepository,
  ],
})
export class UsersModule {}
