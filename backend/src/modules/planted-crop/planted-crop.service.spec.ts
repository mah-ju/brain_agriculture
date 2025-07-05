import { Test, TestingModule } from '@nestjs/testing';
import { PlantedCropService } from './planted-crop.service';

describe('PlantedCropService', () => {
  let service: PlantedCropService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantedCropService],
    }).compile();

    service = module.get<PlantedCropService>(PlantedCropService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
