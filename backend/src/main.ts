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
  
  // Configura CORS ANTES do helmet para evitar conflitos
  const frontendDevUrl = configService.get('FRONTEND_DEV_URL', 'http://localhost:3000');
  const frontendProdUrl = configService.get('FRONTEND_PROD_URL');
  
  const allowedOrigins = [
    frontendDevUrl,
    frontendProdUrl,
    'https://brain-agriculture-gilt.vercel.app', // URL do Vercel (hardcoded como fallback)
  ].filter(Boolean); // Remove valores undefined/null

  // Log para debug
  console.log('🌐 CORS - Origens permitidas:', allowedOrigins);
  console.log('🌐 CORS - FRONTEND_PROD_URL:', frontendProdUrl || '(não configurada)');

  app.enableCors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (ex: Postman, mobile apps)
      if (!origin) {
        return callback(null, true);
      }
      
      // Verifica se a origin está na lista permitida
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('⚠️ CORS bloqueado para origin:', origin);
        console.warn('⚠️ Origens permitidas:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Configura helmet para não interferir com CORS
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );

  await app.listen(configService.get<number>('PORT', 3000));
  console.log(`🚀 Servidor rodando na porta ${configService.get<number>('PORT', 3000)}`);
}
bootstrap();
