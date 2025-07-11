/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { PlantedCropService } from './planted-crop.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

// Tipos auxiliares para mocks
type MockedFarm = {
  id: number;
  producerId: number;
};

type MockedCropSeason = {
  id: number;
  farm: MockedFarm;
};

type MockedPlantedCrop = {
  id: number;
  name: string;
  cropSeasonId: number;
  createdAt: Date;
  updatedAt: Date;
  cropSeason: MockedCropSeason;
};

describe('PlantedCropService', () => {
  let service: PlantedCropService;
  let prisma: PrismaService;

  const mockUserId = 123;

  const mockPlantedCrop: MockedPlantedCrop = {
    id: 1,
    name: 'Milho',
    cropSeasonId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    cropSeason: {
      id: 1,
      farm: {
        id: 1,
        producerId: mockUserId,
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantedCropService,
        {
          provide: PrismaService,
          useValue: {
            plantedCrop: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            cropSeason: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PlantedCropService>(PlantedCropService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a planted crop if user owns the season', async () => {
      const dto = {
        name: 'Milho',
        cropSeasonId: 1,
      };

      const mockSeason: MockedCropSeason = {
        id: 1,
        farm: {
          id: 1,
          producerId: mockUserId,
        },
      };

      jest
        .spyOn(prisma.cropSeason, 'findUnique')
        .mockResolvedValue(mockSeason as any);
      jest
        .spyOn(prisma.plantedCrop, 'create')
        .mockResolvedValue(mockPlantedCrop);

      const result = await service.create(dto, mockUserId);
      expect(result).toEqual(mockPlantedCrop);
    });

    it('should throw NotFoundException if season not found', async () => {
      jest.spyOn(prisma.cropSeason, 'findUnique').mockResolvedValue(null);

      await expect(
        service.create({ name: 'Feijão', cropSeasonId: 999 }, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the season', async () => {
      const otherSeason: MockedCropSeason = {
        id: 1,
        farm: { id: 1, producerId: 999 },
      };

      jest
        .spyOn(prisma.cropSeason, 'findUnique')
        .mockResolvedValue(otherSeason as any);

      await expect(
        service.create({ name: 'Feijão', cropSeasonId: 1 }, mockUserId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return all planted crops', async () => {
      jest
        .spyOn(prisma.plantedCrop, 'findMany')
        .mockResolvedValue([mockPlantedCrop]);

      const result = await service.findAll();
      expect(result).toEqual([mockPlantedCrop]);
    });
  });

  describe('findOne', () => {
    it('should return a planted crop by ID', async () => {
      jest
        .spyOn(prisma.plantedCrop, 'findUnique')
        .mockResolvedValue(mockPlantedCrop);

      const result = await service.findOne(1);
      expect(result).toEqual(mockPlantedCrop);
    });

    it('should throw NotFoundException if crop not found', async () => {
      jest.spyOn(prisma.plantedCrop, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a planted crop if user owns it', async () => {
      jest
        .spyOn(prisma.plantedCrop, 'findUnique')
        .mockResolvedValue(mockPlantedCrop);

      jest.spyOn(prisma.plantedCrop, 'update').mockResolvedValue({
        ...mockPlantedCrop,
        name: 'Atualizado',
      });

      const result = await service.update(
        1,
        { name: 'Atualizado' },
        mockUserId,
      );

      expect(result.name).toBe('Atualizado');
    });

    it('should throw NotFoundException if crop not found', async () => {
      jest.spyOn(prisma.plantedCrop, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update(999, { name: 'Nada' }, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own it', async () => {
      const invalidCrop: MockedPlantedCrop = {
        ...mockPlantedCrop,
        cropSeason: {
          id: 1,
          farm: { id: 1, producerId: 999 },
        },
      };

      jest
        .spyOn(prisma.plantedCrop, 'findUnique')
        .mockResolvedValue(invalidCrop);

      await expect(
        service.update(1, { name: 'X' }, mockUserId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a planted crop if user owns it', async () => {
      jest
        .spyOn(prisma.plantedCrop, 'findUnique')
        .mockResolvedValue(mockPlantedCrop);

      jest
        .spyOn(prisma.plantedCrop, 'delete')
        .mockResolvedValue(mockPlantedCrop);

      const result = await service.remove(1, mockUserId);
      expect(result).toEqual(mockPlantedCrop);
    });

    it('should throw NotFoundException if crop not found', async () => {
      jest.spyOn(prisma.plantedCrop, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(999, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not own it', async () => {
      const invalidCrop: MockedPlantedCrop = {
        ...mockPlantedCrop,
        cropSeason: {
          id: 1,
          farm: { id: 1, producerId: 999 },
        },
      };

      jest
        .spyOn(prisma.plantedCrop, 'findUnique')
        .mockResolvedValue(invalidCrop);

      await expect(service.remove(1, mockUserId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
