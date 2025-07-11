import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Producer } from '@prisma/client';
import { JwtPayloadWithSub } from '../auth/types';
import { Role } from '@prisma/client';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('ProducerService', () => {
  let service: ProducerService;
  let prisma: PrismaService;

  const mockProducer: Producer = {
    id: 1,
    name: 'John Doe',
    cpfOrCnpj: '12345678900',
    password: 'hashedpassword',
    role: 'PRODUCER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const userAdmin: JwtPayloadWithSub = {
    sub: 99,
    role: 'ADMIN',
    cpfOrCnpj: '07654567843',
  };
  const userProducer: JwtPayloadWithSub = {
    sub: 1,
    role: 'PRODUCER',
    cpfOrCnpj: '99999999999',
  };
  const userOtherProducer: JwtPayloadWithSub = {
    sub: 2,
    role: 'PRODUCER',
    cpfOrCnpj: '12345678900',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: PrismaService,
          useValue: {
            producer: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should hash password and create producer', async () => {
      const createDto = { name: 'John', cpfOrCnpj: '123', password: 'secret' };

      const createSpy = jest
        .spyOn(prisma.producer, 'create')
        .mockResolvedValue(mockProducer);

      const result = await service.create(createDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
      expect(createSpy).toHaveBeenCalledWith({
        data: { ...createDto, password: 'hashedPassword' },
      });
      expect(result).toEqual(mockProducer);
    });
  });

  describe('findOne', () => {
    it('should return a producer if found', async () => {
      prisma.producer.findUnique = jest.fn().mockResolvedValue(mockProducer);
      const result = await service.findOne(1);
      expect(result).toEqual(mockProducer);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.producer.findUnique = jest.fn().mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update producer if authorized', async () => {
      prisma.producer.findUnique = jest.fn().mockResolvedValue(mockProducer);
      prisma.producer.update = jest
        .fn()
        .mockResolvedValue({ ...mockProducer, name: 'New Name' });

      const updateDto = { name: 'New Name' };
      const result = await service.update(1, updateDto, userProducer);

      expect(result.name).toBe('New Name');
    });

    it('should throw ForbiddenException if unauthorized', async () => {
      prisma.producer.findUnique = jest.fn().mockResolvedValue(mockProducer);
      const updateDto = { name: 'New Name' };
      await expect(
        service.update(1, updateDto, userOtherProducer),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if producer does not exist', async () => {
      prisma.producer.findUnique = jest.fn().mockResolvedValue(null);
      const updateDto = { name: 'New Name' };
      await expect(service.update(999, updateDto, userAdmin)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeOwnProducer', () => {
    it('should delete own producer if exists', async () => {
      prisma.producer.findUnique = jest.fn().mockResolvedValue(mockProducer);
      prisma.producer.delete = jest.fn().mockResolvedValue(mockProducer);

      const result = await service.removeOwnProducer(1);
      expect(result).toEqual(mockProducer);
    });

    it('should throw NotFoundException if own producer not found', async () => {
      prisma.producer.findUnique = jest.fn().mockResolvedValue(null);
      await expect(service.removeOwnProducer(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete producer if admin', async () => {
      prisma.producer.findUnique = jest.fn().mockResolvedValue(mockProducer);
      prisma.producer.delete = jest.fn().mockResolvedValue(mockProducer);

      const result = await service.remove(1);
      expect(result).toEqual(mockProducer);
    });

    it('should throw NotFoundException if producer does not exist', async () => {
      prisma.producer.findUnique = jest.fn().mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return mapped producers with farms and crop seasons', async () => {
      const mockProducersWithNestedData = [
        {
          id: 1,
          name: 'John Doe',
          cpfOrCnpj: '12345678900',
          password: 'hashedpassword',
          role: 'PRODUCER' as Role,
          createdAt: new Date(),
          updatedAt: new Date(),
          farms: [
            {
              id: 10,
              name: 'Fazenda 1',
              city: 'Cidade A',
              state: 'Estado A',
              totalArea: 100,
              arableArea: 70,
              vegetationArea: 30,
              cropSeasons: [
                {
                  id: 100,
                  year: 2024,
                  plantedCrops: [
                    { id: 1000, name: 'Milho' },
                    { id: 1001, name: 'Soja' },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const findManySpy = jest
        .spyOn(prisma.producer, 'findMany')
        .mockResolvedValue(mockProducersWithNestedData);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: 1,
          name: 'John Doe',
          cpfOrCnpj: '12345678900',
          farms: [
            {
              id: 10,
              name: 'Fazenda 1',
              city: 'Cidade A',
              state: 'Estado A',
              totalArea: 100,
              arableArea: 70,
              vegetationArea: 30,
              cropSeasons: [
                {
                  id: 100,
                  year: 2024,
                  plantedCrops: [
                    { id: 1000, name: 'Milho' },
                    { id: 1001, name: 'Soja' },
                  ],
                },
              ],
            },
          ],
        },
      ]);
      expect(findManySpy).toHaveBeenCalled();
    });
  });
});
