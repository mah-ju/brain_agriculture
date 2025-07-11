/* eslint-disable @typescript-eslint/no-misused-promises */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    name: 'Mock Producer',
    cpfOrCnpj: '12345678901',
    password: 'hashedPassword',
    role: Role.PRODUCER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByCpfOrCnpj: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return the user if credentials are valid', async () => {
      jest.spyOn(usersService, 'findByCpfOrCnpj').mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser(
        mockUser.cpfOrCnpj,
        'plainPass',
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersService, 'findByCpfOrCnpj').mockResolvedValue(null);

      await expect(
        service.validateUser(mockUser.cpfOrCnpj, 'plainPass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(usersService, 'findByCpfOrCnpj').mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.validateUser(mockUser.cpfOrCnpj, 'wrongPass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signIn', () => {
    it('should return access_token if credentials are valid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockedToken');

      const result = await service.signIn(mockUser.cpfOrCnpj, 'plainPass');
      expect(result).toEqual({ access_token: 'mockedToken' });
    });
  });

  describe('generateToken', () => {
    it('should return a valid JWT token for the user', async () => {
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockedToken');

      const result = await service.generateToken(mockUser);
      expect(result).toEqual({ access_token: 'mockedToken' });
    });
  });
});
