import { Test, TestingModule } from '@nestjs/testing';
import { PlantedCropController } from './planted-crop.controller';

describe('PlantedCropController', () => {
  let controller: PlantedCropController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantedCropController],
    }).compile();

    controller = module.get<PlantedCropController>(PlantedCropController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
