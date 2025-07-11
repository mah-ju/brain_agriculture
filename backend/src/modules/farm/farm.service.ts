import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { JwtPayloadWithSub } from '../auth/types';

@Injectable()
export class FarmService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFarmDto, producerId: number) {
    return this.prisma.farm.create({
      data: {
        ...data,
        producer: {
          connect: { id: producerId },
        },
      },
    });
  }

  async findAll(producerId: number) {
    return this.prisma.farm.findMany({
      where: { producerId },
      include: {
        producer: true,
      },
    });
  }

  async findOne(id: number) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: {
        producer: true,
      },
    });

    if (!farm) {
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada`);
    }

    return farm;
  }

  async update(id: number, data: UpdateFarmDto, user: JwtPayloadWithSub) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: { producer: true },
    });

    if (!farm) {
      throw new NotFoundException(
        `Não é possível atualizar: fazenda com ID ${id} não encontrada`,
      );
    }

    if (user.role !== 'ADMIN' && farm.producer.id !== user.sub) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar essa fazenda',
      );
    }

    const validationData = {
      totalArea: data.totalArea ?? farm.totalArea,
      arableArea: data.arableArea ?? farm.arableArea,
      vegetationArea: data.vegetationArea ?? farm.vegetationArea,
    };

    if (
      validationData.arableArea + validationData.vegetationArea >
      validationData.totalArea
    ) {
      throw new BadRequestException(
        'A soma da área agricultável e vegetação não pode ser maior que a área total',
      );
    }

    return this.prisma.farm.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, user: JwtPayloadWithSub) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: { producer: true },
    });

    if (!farm) {
      throw new NotFoundException(
        `Não é possível excluir: fazenda com ID ${id} não encontrada`,
      );
    }

    if (user.role !== 'ADMIN' && farm.producer.id !== user.sub) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar essa fazenda',
      );
    }

    return this.prisma.farm.delete({ where: { id } });
  }
}
