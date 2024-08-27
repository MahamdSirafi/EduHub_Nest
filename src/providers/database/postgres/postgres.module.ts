import { Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { ConfigModule } from '@nestjs/config';
import PostgresConfig from '../../../config/database/postgres';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '../../../config/app';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresService,
      imports: [
        ConfigModule.forFeature(PostgresConfig),
        ConfigModule.forFeature(AppConfig),
      ],
    }),
  ],
  providers: [],
})
export class PostgresModule {}
