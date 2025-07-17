import { forwardRef, Module } from '@nestjs/common';
import { PlantedCropController } from './planted-crop.controller';
import { PlantedCropService } from './planted-crop.service';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [forwardRef(() => AdminModule)],
  controllers: [PlantedCropController],
  providers: [PlantedCropService],
  exports: [PlantedCropService],
})
export class PlantedCropModule {}
