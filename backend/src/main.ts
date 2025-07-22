import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/exceptions/http-exception.filter';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(helmet());
  app.enableCors({
    origin: [
      configService.get('FRONTEND_DEV_URL', 'http://localhost:3000'), // Local
      configService.get(
        'FRONTEND_PROD_URL',
        'https://brain-agriculture-gilt.vercel.app',
      ), // Vercel
      configService.get(
        'RAILWAY_URL',
        'https://brainagriculture-production-af57.up.railway.app',
      ), // Backend
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(configService.get<number>('PORT', 3000));
}
bootstrap();
