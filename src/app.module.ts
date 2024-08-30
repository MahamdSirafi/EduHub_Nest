import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './shared/cloudinary';
import {
  IsExistConstraint,
  IsPhotoExistConstraint,
  IsUniqueConstraint,
} from './common/decorators';
import { JwtGuard } from './common/guards';
import { PhotosModule } from './photos/photos.module';
import { PhotoCleanupModule } from './jobs/photo-cleanup';
import { AdminsModule } from './models/admins/admins.module';
import { PermissionsModule } from './models/permissions/permissions.module';
import { RolesModule } from './models/roles/roles.module';
import { UsersModule } from './models/users/users.module';
import { DatabaseModule } from './providers/database';
import { CaslModule } from './shared/casl';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtTokenModule } from './shared/jwt';
import { LoggerMiddleware } from './common/middlewares';
import { LoggerModule } from './shared/logger/logger.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TeachersModule } from './models/teachers/teacher.module';
import { CoursesModule } from './models/courses/course.module';
import { AuthTeacherModule } from './auth teacher/auth.module';
import { VideoModule } from './models/videos/video.module';
import { ApplyModule } from './models/applies/apply.module';
import { QuestionModule } from './models/question/question.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ENV: Joi.string().required(),
        JWT_SECRET: Joi.string(),
        JWT_EXPIRES_IN: Joi.string(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASS: Joi.string().required(),
        POSTGRES_NAME: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
      }),
      // load: [postgresConfig],
    }),

    DevtoolsModule.register({ http: process.env.ENV !== 'production' }),
    ApplyModule,
    QuestionModule,
    VideoModule,
    CoursesModule,
    AuthModule,
    AuthTeacherModule,
    AdminsModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    PhotosModule,
    DatabaseModule,
    JwtTokenModule,
    PhotoCleanupModule,
    CaslModule,
    CloudinaryModule,
    LoggerModule,
    TeachersModule,
  ],
  providers: [
    IsUniqueConstraint,
    IsExistConstraint,
    IsPhotoExistConstraint,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
