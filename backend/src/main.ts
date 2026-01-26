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
  // Configura CORS com origens permitidas
  const allowedOrigins = [
    configService.get('FRONTEND_DEV_URL', 'http://localhost:3000'), // Local
    configService.get('FRONTEND_PROD_URL'), // Vercel (obrigatório em produção)
  ].filter(Boolean); // Remove valores undefined/null

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(configService.get<number>('PORT', 3000));
}
bootstrap();
