/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CropSeasonController } from './crop-season.controller';
import { CropSeasonService } from './crop-season.service';
import { CreateCropSeasonDto } from './dto/create-crop-season.dto';
import { UpdateCropSeasonDto } from './dto/update-crop-season.dto';
import { Request } from 'express';

describe('CropSeasonController', () => {
  let controller: CropSeasonController;
  let service: CropSeasonService;

  const mockUser = {
    sub: 1,
    role: 'PRODUCER',
    cpfOrCnpj: '00000000000',
  };

  const mockCropSeason = {
    id: 1,
    year: 2024,
    farmId: 10,
    farm: { id: 10, producerId: 1 },
    plantedCrops: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropSeasonController],
      providers: [
        {
          provide: CropSeasonService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCropSeason),
            findAll: jest.fn().mockResolvedValue([mockCropSeason]),
            findOne: jest.fn().mockResolvedValue(mockCropSeason),
            update: jest
              .fn()
              .mockResolvedValue({ ...mockCropSeason, year: 2025 }),
            remove: jest.fn().mockResolvedValue(mockCropSeason),
          },
        },
      ],
    }).compile();

    controller = module.get<CropSeasonController>(CropSeasonController);
    service = module.get<CropSeasonService>(CropSeasonService);
  });

  describe('create', () => {
    it('should call service.create with dto and user.sub', async () => {
      const dto: CreateCropSeasonDto = { year: 2024, farmId: 10 };
      const req = { user: mockUser } as Partial<Request> as Request;

      const result = await controller.create(dto, req);

      expect(service.create).toHaveBeenCalledWith(dto, mockUser.sub);
      expect(result).toEqual(mockCropSeason);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with user.sub', async () => {
      const req = { user: mockUser } as Partial<Request> as Request;

      const result = await controller.findAll(req);

      expect(service.findAll).toHaveBeenCalledWith(mockUser.sub);
      expect(result).toEqual([mockCropSeason]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCropSeason);
    });
  });

  describe('update', () => {
    it('should call service.update with id, dto, and user.sub', async () => {
      const dto: UpdateCropSeasonDto = { year: 2025 };
      const req = { user: mockUser } as Partial<Request> as Request;

      const result = await controller.update(1, dto, req);

      expect(service.update).toHaveBeenCalledWith(1, dto, mockUser.sub);
      expect(result.year).toBe(2025);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id and user.sub', async () => {
      const req = { user: mockUser } as Partial<Request> as Request;

      const result = await controller.remove(1, req);

      expect(service.remove).toHaveBeenCalledWith(1, mockUser.sub);
      expect(result).toEqual(mockCropSeason);
    });
  });
});
