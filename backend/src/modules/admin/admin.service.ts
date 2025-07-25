import { Injectable, Inject } from '@nestjs/common';
import { FarmService } from '../farm/farm.service';
import { PlantedCropService } from '../planted-crop/planted-crop.service';
import { forwardRef } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(
    @Inject(forwardRef(() => FarmService))
    private readonly farmService: FarmService,
    @Inject(forwardRef(() => PlantedCropService))
    private readonly plantedCropService: PlantedCropService,
  ) {}

  async getData() {
    const totalFarms = await this.farmService.countAll();
    const totalArea = await this.farmService.sumTotalArea();
    const byState = await this.farmService.countByState();
    const byCrop = await this.plantedCropService.countByPlantedCrops();
    const bySoilUse = await this.farmService.sumBySoilUse();

    return {
      totalFarms,
      totalArea,
      byState,
      byCrop,
      bySoilUse,
    };
  }
}
