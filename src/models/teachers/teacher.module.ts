import { Module, Provider } from '@nestjs/common';
import { TeacherRepository } from './repositories/teacher.repository';
import { TeacherPhotosRepository } from './repositories/teacher-photos.repository';
import { WalleTRepository } from './repositories/wallet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { TeacherWallet } from './entities/wallet.entity';
import { TeacherPhoto } from './entities/teacher-photo.entity';
import { Role } from '../roles/entities/role.entity';
import { RoleRepository } from '../roles/repositories/role.repository';
import { UsersController } from './controllers/teachers.controller';
import { TeachersService } from './services/teacher.service';
import { Teacher_TYPES } from './interfaces/type';

export const TeacherssServiceProvider: Provider = {
  provide: Teacher_TYPES.service,
  useClass: TeachersService,
};

export const TeacherRepositoryProvider: Provider = {
  provide: Teacher_TYPES.repository.teacher,
  useClass: TeacherRepository,
};
export const TeacherPhotosRepositoryProvider: Provider = {
  provide: Teacher_TYPES.repository.teacher_photos,
  useClass: TeacherPhotosRepository,
};

export const WalletRepositoryProvider: Provider = {
  provide: Teacher_TYPES.repository.wallet,
  useClass: WalleTRepository,
};
@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher, TeacherWallet, TeacherPhoto, Role]),
  ],
  controllers: [UsersController],
  providers: [
    TeacherPhotosRepositoryProvider,
    TeacherRepositoryProvider,
    WalletRepositoryProvider,
    TeacherssServiceProvider,
    WalleTRepository,
    RoleRepository,
  ],
  exports: [
    TeacherPhotosRepositoryProvider,
    TeacherRepositoryProvider,
    WalletRepositoryProvider,
    TeacherssServiceProvider,
    WalleTRepository,
  ],
})
export class TeachersModule {}
