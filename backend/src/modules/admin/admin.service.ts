import { Injectable, Inject } from '@nestjs/common';
import { FarmService } from '../farm/farm.service';
import { PlantedCropService } from '../planted-crop/planted-crop.service';
import { forwardRef } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(
    @Inject(forwardRef(() => FarmService))
    private farmService: FarmService,
    @Inject(forwardRef(() => PlantedCropService))
    private plantedCropService: PlantedCropService,
  ) {}

  async getData() {
    // Aqui você faria as contagens e agrupamentos
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
