import { Test, TestingModule } from '@nestjs/testing';
import { CropSeasonController } from './crop-season.controller';

describe('CropSeasonController', () => {
  let controller: CropSeasonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropSeasonController],
    }).compile();

    controller = module.get<CropSeasonController>(CropSeasonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
