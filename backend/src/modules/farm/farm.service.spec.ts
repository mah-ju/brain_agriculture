import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from './farm.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtPayloadWithSub } from '../auth/types';
import { Prisma } from '@prisma/client';

export type FarmWithProducer = Prisma.FarmGetPayload<{
  include: { producer: true; cropSeasons: true };
}>;

describe('FarmService', () => {
  let service: FarmService;
  let prisma: PrismaService;

  const mockUser: JwtPayloadWithSub = {
    sub: 1,
    role: 'PRODUCER',
    cpfOrCnpj: '99999999999',
  };

  const mockAdmin: JwtPayloadWithSub = {
    sub: 99,
    role: 'ADMIN',
    cpfOrCnpj: '00000000000',
  };

  const mockFarm: FarmWithProducer = {
    id: 1,
    name: 'Fazenda Teste',
    city: 'Cidade A',
    state: 'Estado A',
    totalArea: 100,
    arableArea: 60,
    vegetationArea: 30,
    producerId: 1,
    producer: {
      id: 1,
      name: 'Produtor teste',
      cpfOrCnpj: '12345678900',
      password: 'senha',
      role: 'PRODUCER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    cropSeasons: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: PrismaService,
          useValue: {
            farm: {
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

    service = module.get<FarmService>(FarmService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a farm for a producer', async () => {
      const createDto = {
        name: 'Nova Fazenda',
        city: 'Cidade A',
        state: 'Estado A',
        totalArea: 100,
        arableArea: 50,
        vegetationArea: 30,
        checkAreas: true,
      };

      jest
        .spyOn(prisma.farm, 'create')
        .mockResolvedValue({ ...mockFarm, ...createDto });

      const result = await service.create(createDto, mockUser.sub);
      expect(result).toEqual(expect.objectContaining(createDto));
    });
  });

  describe('findAll', () => {
    it('should return farms for a producer', async () => {
      jest.spyOn(prisma.farm, 'findMany').mockResolvedValue([mockFarm]);

      const result = await service.findAll(mockUser.sub);
      expect(result).toEqual([mockFarm]);
    });
  });

  describe('findOne', () => {
    it('should return a farm by ID', async () => {
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue(mockFarm);

      const result = await service.findOne(1);
      expect(result).toEqual(mockFarm);
    });

    it('should throw NotFoundException if not found', async () => {
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a farm if owner', async () => {
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue(mockFarm);
      jest
        .spyOn(prisma.farm, 'update')
        .mockResolvedValue({ ...mockFarm, name: 'Atualizada' });

      const result = await service.update(1, { name: 'Atualizada' }, mockUser);
      expect(result.name).toBe('Atualizada');
    });

    it('should throw NotFoundException if farm not found', async () => {
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update(999, { name: 'Qualquer' }, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner or admin', async () => {
      const unauthorizedFarm = {
        ...mockFarm,
        producer: { ...mockFarm.producer, id: 999 },
        producerId: 999,
      };
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue(unauthorizedFarm);

      await expect(
        service.update(1, { name: 'Update' }, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if sum of areas exceeds totalArea', async () => {
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue(mockFarm);

      await expect(
        service.update(
          1,
          {
            arableArea: 70,
            vegetationArea: 40,
          },
          mockUser,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a farm if user is owner', async () => {
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue(mockFarm);
      jest.spyOn(prisma.farm, 'delete').mockResolvedValue(mockFarm);

      const result = await service.remove(1, mockUser);
      expect(result).toEqual(mockFarm);
    });

    it('should delete a farm if user is admin', async () => {
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue(mockFarm);
      jest.spyOn(prisma.farm, 'delete').mockResolvedValue(mockFarm);

      const result = await service.remove(1, mockAdmin);
      expect(result).toEqual(mockFarm);
    });

    it('should throw NotFoundException if farm not found', async () => {
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(999, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if not owner or admin', async () => {
      const unauthorizedFarm = {
        ...mockFarm,
        producer: { ...mockFarm.producer, id: 999 },
        producerId: 999,
      };
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue(unauthorizedFarm);

      await expect(service.remove(1, mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
