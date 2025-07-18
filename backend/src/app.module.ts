import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerModule } from './modules/producer/producer.module';
import { PlantedCropModule } from './modules/planted-crop/planted-crop.module';
import { CropSeasonModule } from './modules/crop-season/crop-season.module';
import { FarmModule } from './modules/farm/farm.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProducerModule,
    FarmModule,
    CropSeasonModule,
    PlantedCropModule,
    AuthModule,
    UsersModule,
    AdminModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
