/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { JwtPayloadWithSub } from '../auth/types';
import { Request } from 'express';

describe('FarmController', () => {
  let controller: FarmController;
  let service: FarmService;

  const mockUser: JwtPayloadWithSub = {
    sub: 1,
    role: 'PRODUCER',
    cpfOrCnpj: '99999999999',
  };

  const mockFarm = {
    id: 1,
    name: 'Atualizada',
    city: 'Cidade A',
    state: 'Estado A',
    totalArea: 100,
    arableArea: 60,
    vegetationArea: 30,
    producerId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockFarm),
    findAll: jest.fn().mockResolvedValue([mockFarm]),
    findOne: jest.fn().mockResolvedValue(mockFarm),
    update: jest.fn().mockResolvedValue({ ...mockFarm, name: 'Atualizada' }),
    remove: jest.fn().mockResolvedValue(mockFarm),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [
        {
          provide: FarmService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<FarmController>(FarmController);
    service = module.get<FarmService>(FarmService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto and user.sub', async () => {
      const dto: CreateFarmDto = {
        name: 'Nova Fazenda',
        city: 'Cidade A',
        state: 'Estado A',
        totalArea: 100,
        arableArea: 50,
        vegetationArea: 30,
        checkAreas: true,
        cropSeasons: [
          {
            year: 2023,
            plantedCrops: [{ name: 'Algodão' }, { name: 'Soja' }],
          },
        ],
      };
      const req = { user: mockUser } as Partial<Request> as Request;
      const result = await controller.create(dto, req);
      expect(service.create).toHaveBeenCalledWith(dto, mockUser.sub);
      expect(result).toEqual(mockFarm);
    });
  });

  describe('findAll', () => {
    it('should return all farms for logged in user', async () => {
      const req = { user: mockUser } as Partial<Request> as Request;
      const result = await controller.findAll(req);
      expect(service.findAll).toHaveBeenCalledWith(mockUser.sub);
      expect(result).toEqual([mockFarm]);
    });
  });

  describe('findOne', () => {
    it('should return one farm by ID', async () => {
      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockFarm);
    });
  });

  describe('update', () => {
    it('should update a farm if user is authorized', async () => {
      const dto: UpdateFarmDto = { name: 'Atualizada' };
      const req = { user: mockUser } as Partial<Request> as Request;

      const result = await controller.update(1, dto, req);
      expect(service.update).toHaveBeenCalledWith(1, dto, mockUser);
      expect(result!.name).toBe('Atualizada');
    });
  });

  describe('remove', () => {
    it('should remove a farm by ID if authorized', async () => {
      const req = { user: mockUser } as Partial<Request> as Request;

      const result = await controller.remove(1, req);
      expect(service.remove).toHaveBeenCalledWith(1, mockUser);
      expect(result).toEqual(mockFarm);
    });
  });
});
