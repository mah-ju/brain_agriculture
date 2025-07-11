/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PlantedCropController } from './planted-crop.controller';
import { PlantedCropService } from './planted-crop.service';
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto';
import { UpdatePlantedCropDto } from './dto/update-planted-crop.dto';
import { JwtPayloadWithSub } from '../auth/types';
import { Request } from 'express';

describe('PlantedCropController', () => {
  let controller: PlantedCropController;
  let service: PlantedCropService;

  const mockUser: JwtPayloadWithSub = {
    sub: 123,
    cpfOrCnpj: '03256587655',
    role: 'PRODUCER',
  };

  const mockRequest = {
    user: mockUser,
  } as Partial<Request> as Request;

  const mockPlantedCrop = {
    id: 1,
    name: 'Milho',
    cropSeasonId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantedCropController],
      providers: [
        {
          provide: PlantedCropService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PlantedCropController>(PlantedCropController);
    service = module.get<PlantedCropService>(PlantedCropService);
  });

  describe('create', () => {
    it('should call service.create with dto and user id', async () => {
      const dto: CreatePlantedCropDto = { name: 'Milho', cropSeasonId: 1 };
      mockService.create.mockResolvedValue(mockPlantedCrop);

      const result = await controller.create(dto, mockRequest);
      expect(service.create).toHaveBeenCalledWith(dto, mockUser.sub);
      expect(result).toEqual(mockPlantedCrop);
    });
  });

  describe('findAll', () => {
    it('should return all planted crops', async () => {
      mockService.findAll.mockResolvedValue([mockPlantedCrop]);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockPlantedCrop]);
    });
  });

  describe('findOne', () => {
    it('should return a planted crop by id', async () => {
      mockService.findOne.mockResolvedValue(mockPlantedCrop);

      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPlantedCrop);
    });
  });

  describe('update', () => {
    it('should update a planted crop', async () => {
      const dto: UpdatePlantedCropDto = { name: 'Atualizado' };
      const updated = { ...mockPlantedCrop, name: 'Atualizado' };

      mockService.update.mockResolvedValue(updated);

      const result = await controller.update(1, dto, mockRequest);
      expect(service.update).toHaveBeenCalledWith(1, dto, mockUser.sub);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove a planted crop', async () => {
      mockService.remove.mockResolvedValue(mockPlantedCrop);

      const result = await controller.remove(1, mockRequest);
      expect(service.remove).toHaveBeenCalledWith(1, mockUser.sub);
      expect(result).toEqual(mockPlantedCrop);
    });
  });
});
