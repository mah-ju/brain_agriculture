import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Producer } from '@prisma/client';
import { Request } from 'express';

type MockRequest = Partial<Request> & { user: Producer };

describe('AuthController', () => {
  let controller: AuthController;

  const mockUser: Producer = {
    id: 1,
    cpfOrCnpj: '12345678900',
    password: 'hashed-password',
    role: 'PRODUCER',
    name: 'Teste',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockToken = { access_token: 'fake-jwt-token' };

  const mockAuthService = {
    generateToken: jest.fn().mockResolvedValue(mockToken),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        Reflector,
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest<MockRequest>();
          req.user = mockUser;
          return true;
        },
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest<MockRequest>();
          req.user = mockUser;
          return true;
        },
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      const req = { user: mockUser } as Request & { user: typeof mockUser };
      const result = await controller.login(req);
      expect(result).toEqual(mockToken);
      expect(mockAuthService.generateToken).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getProfile', () => {
    it('should return the authenticated user', () => {
      const req = { user: mockUser } as Request & { user: typeof mockUser };
      const result = controller.getProfile(req);
      expect(result).toEqual(mockUser);
    });
  });
});
