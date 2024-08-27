import { NestFactory } from '@nestjs/core';
import { InitialDatabaseSeeder } from './database/seeders';
import { SeederModule } from './database/seeders/seeder.module';
import { LoggerService } from './shared/logger/logger.service';

async function bootstrap() {
  await NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const logger = appContext.get(LoggerService);
      const seeder = appContext.get(InitialDatabaseSeeder);
      seeder
        .seed()
        .then(() => {
          logger.debug('Seeder', 'Seeding complete!');
        })
        .catch((error) => {
          logger.error('Seeder', 'Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
