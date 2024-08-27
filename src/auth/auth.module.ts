import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategy';
import { UsersModule } from '../models/users/users.module';
import { AdminsModule } from '../models/admins/admins.module';
import { RolesModule } from '../models/roles/roles.module';

@Module({
  imports: [
    PassportModule.register({}),
    UsersModule,
    AdminsModule,
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
