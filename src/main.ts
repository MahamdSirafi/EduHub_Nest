import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument, errorsFormat } from './common/helpers';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AppConfig } from './config/app';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { LoggerService } from './shared/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
  });
  const httpAdapter = app.get(HttpAdapterHost);
  const logger = app.get(LoggerService);
  const appConfig: ConfigType<typeof AppConfig> = app
    .get(ConfigService)
    .get('application');

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if (appConfig.env !== 'production') {
    app.use(morgan('dev'));
  }
  app.use(
    helmet({
      xssFilter: true,
      contentSecurityPolicy: true,
      xPoweredBy: false,
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    extensions: ['jpg', 'css', 'png'],
    index: false,
  });
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter, appConfig));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
      exceptionFactory: (errors) => {
        errorsFormat(errors);
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api');
  const { document, setupOptions } = createDocument(app);
  SwaggerModule.setup('api', app, document, setupOptions);
  await app.listen(appConfig.port, () => {
    logger.debug('APP', `server started at port: ${appConfig.port}`);
    logger.debug(
      'APP',
      `swagger docs started at http://localhost:${appConfig.port}/api`,
    );
  });
}
bootstrap();
