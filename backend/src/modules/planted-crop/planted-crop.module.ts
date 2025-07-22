import { forwardRef, Module } from '@nestjs/common';
import { PlantedCropController } from './planted-crop.controller';
import { PlantedCropService } from './planted-crop.service';
import { AdminModule } from '../admin/admin.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [forwardRef(() => AdminModule), PrismaModule],
  controllers: [PlantedCropController],
  providers: [PlantedCropService],
  exports: [PlantedCropService],
})
export class PlantedCropModule {}
