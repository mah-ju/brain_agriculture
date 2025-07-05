import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Producer } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByCpfOrCnpj(cpfOrCnpj: string): Promise<Producer | null> {
    return this.prisma.producer.findUnique({ where: { cpfOrCnpj } });
  }
}
