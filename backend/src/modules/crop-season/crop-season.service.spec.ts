import { Test, TestingModule } from '@nestjs/testing';
import { CropSeasonService } from './crop-season.service';

describe('CropSeasonService', () => {
  let service: CropSeasonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CropSeasonService],
    }).compile();

    service = module.get<CropSeasonService>(CropSeasonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
