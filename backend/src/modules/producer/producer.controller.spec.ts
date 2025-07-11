/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { JwtPayloadWithSub } from '../auth/types';
import { Request } from 'express';

describe('ProducerController', () => {
  let controller: ProducerController;
  let service: ProducerService;

  const mockUser: JwtPayloadWithSub = {
    sub: 1,
    role: 'PRODUCER',
    cpfOrCnpj: '99999999999',
  };

  const mockProducer = {
    id: 1,
    name: 'John',
    cpfOrCnpj: '123',
    password: 'hashedPassword',
    role: 'PRODUCER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockProducer),
    findAll: jest.fn().mockResolvedValue([mockProducer]),
    findOne: jest.fn().mockResolvedValue(mockProducer),
    update: jest.fn().mockResolvedValue({ ...mockProducer, name: 'Updated' }),
    removeOwnProducer: jest.fn().mockResolvedValue(mockProducer),
    remove: jest.fn().mockResolvedValue(mockProducer),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [
        {
          provide: ProducerService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProducerController>(ProducerController);
    service = module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto and return result', async () => {
      const dto: CreateProducerDto = {
        name: 'John',
        cpfOrCnpj: '123',
        password: 'secret',
      };

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockProducer);
    });
  });

  describe('findAll', () => {
    it('should return all producers', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockProducer]);
    });
  });

  describe('findOne', () => {
    it('should return one producer by ID', async () => {
      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProducer);
    });
  });

  describe('update', () => {
    it('should update a producer if user matches', async () => {
      const dto: UpdateProducerDto = { name: 'Updated' };
      const req = { user: mockUser } as Request & { user: JwtPayloadWithSub };

      const result = await controller.update(1, dto, req);
      expect(service.update).toHaveBeenCalledWith(1, dto, mockUser);
      expect(result.name).toBe('Updated');
    });
  });

  describe('removeOwn', () => {
    it('should remove the logged-in producer', async () => {
      const req = { user: mockUser } as Request & { user: JwtPayloadWithSub };
      const result = await controller.removeOwn(req);
      expect(service.removeOwnProducer).toHaveBeenCalledWith(mockUser.sub);
      expect(result).toEqual(mockProducer);
    });
  });

  describe('remove', () => {
    it('should remove a producer by id', async () => {
      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProducer);
    });
  });
});
