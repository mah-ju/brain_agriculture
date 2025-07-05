import { Module } from '@nestjs/common';
import { PlantedCropController } from './planted-crop.controller';
import { PlantedCropService } from './planted-crop.service';

@Module({
  controllers: [PlantedCropController],
  providers: [PlantedCropService]
})
export class PlantedCropModule {}
