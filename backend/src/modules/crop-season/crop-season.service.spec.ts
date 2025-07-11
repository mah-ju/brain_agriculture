import { Test, TestingModule } from '@nestjs/testing';
import { CropSeasonService } from './crop-season.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCropSeasonDto } from './dto/create-crop-season.dto';
import { UpdateCropSeasonDto } from './dto/update-crop-season.dto';

describe('CropSeasonService', () => {
  let service: CropSeasonService;
  let prisma: PrismaService;

  const mockUserId = 1;

  const mockFarm = {
    id: 10,
    producerId: mockUserId,
  };

  const mockCropSeason = {
    id: 1,
    year: 2024,
    farmId: 10,
    farm: { producerId: mockUserId },
    plantedCrops: [{ name: 'Milho' }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropSeasonService,
        {
          provide: PrismaService,
          useValue: {
            farm: {
              findUnique: jest.fn(),
            },
            cropSeason: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CropSeasonService>(CropSeasonService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create crop season if farm exists and belongs to user', async () => {
      const dto: CreateCropSeasonDto = { year: 2024, farmId: 10 };
      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(mockFarm);
      (prisma.cropSeason.create as jest.Mock).mockResolvedValue(mockCropSeason);

      const result = await service.create(dto, mockUserId);
      expect(result).toEqual(mockCropSeason);
    });

    it('should throw NotFoundException if farm does not exist', async () => {
      (prisma.farm.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create({ year: 2024, farmId: 10 }, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if farm belongs to another user', async () => {
      (prisma.farm.findUnique as jest.Mock).mockResolvedValue({
        ...mockFarm,
        producerId: 999,
      });

      await expect(
        service.create({ year: 2024, farmId: 10 }, mockUserId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return all crop seasons of the producer', async () => {
      (prisma.cropSeason.findMany as jest.Mock).mockResolvedValue([
        mockCropSeason,
      ]);

      const result = await service.findAll(mockUserId);
      expect(result).toEqual([mockCropSeason]);
    });
  });

  describe('findOne', () => {
    it('should return one crop season by id', async () => {
      (prisma.cropSeason.findUnique as jest.Mock).mockResolvedValue(
        mockCropSeason,
      );

      const result = await service.findOne(1);
      expect(result).toEqual(mockCropSeason);
    });

    it('should throw NotFoundException if crop season not found', async () => {
      (prisma.cropSeason.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update crop season if owned by user', async () => {
      const updateDto: UpdateCropSeasonDto = { year: 2025 };
      (prisma.cropSeason.findUnique as jest.Mock).mockResolvedValue(
        mockCropSeason,
      );
      (prisma.cropSeason.update as jest.Mock).mockResolvedValue({
        ...mockCropSeason,
        ...updateDto,
      });

      const result = await service.update(1, updateDto, mockUserId);
      expect(result.year).toBe(2025);
    });

    it('should throw NotFoundException if crop season not found', async () => {
      (prisma.cropSeason.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update(1, { year: 2025 }, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if crop season is not owned by user', async () => {
      (prisma.cropSeason.findUnique as jest.Mock).mockResolvedValue({
        ...mockCropSeason,
        farm: { producerId: 999 },
      });

      await expect(
        service.update(1, { year: 2025 }, mockUserId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove crop season if owned by user', async () => {
      (prisma.cropSeason.findUnique as jest.Mock).mockResolvedValue(
        mockCropSeason,
      );
      (prisma.cropSeason.delete as jest.Mock).mockResolvedValue(mockCropSeason);

      const result = await service.remove(1, mockUserId);
      expect(result).toEqual(mockCropSeason);
    });

    it('should throw NotFoundException if crop season not found', async () => {
      (prisma.cropSeason.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(1, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if crop season is not owned by user', async () => {
      (prisma.cropSeason.findUnique as jest.Mock).mockResolvedValue({
        ...mockCropSeason,
        farm: { producerId: 999 },
      });

      await expect(service.remove(1, mockUserId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
