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
  countByPlantedCrops() {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFarmDto, producerId: number) {
    const { cropSeasons, ...farmData } = data;

    return this.prisma.farm.create({
      data: {
        ...farmData,
        producer: {
          connect: { id: producerId },
        },
        cropSeasons: {
          create: cropSeasons.map((season) => ({
            year: season.year,
            plantedCrops: {
              create: season.plantedCrops.map((crop) => ({
                name: crop.name,
              })),
            },
          })),
        },
      },
      include: {
        cropSeasons: {
          include: {
            plantedCrops: true,
          },
        },
      },
    });
  }

  async findAll(producerId: number) {
    return this.prisma.farm.findMany({
      where: { producerId },
      include: {
        cropSeasons: {
          include: {
            plantedCrops: true,
          },
        },
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cropSeasons, ...safeDate } = data;

    return this.prisma.farm.update({
      where: { id },
      data: safeDate,
    });
  }

  async remove(id: number, user: JwtPayloadWithSub) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: {
        producer: true,
      },
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

    await this.prisma.farm.delete({ where: { id } });

    return { message: 'Fazenda deletada com sucesso' };
  }

  async countAll(): Promise<number> {
    return this.prisma.farm.count();
  }

  async countByState(): Promise<{ state: string; count: number }[]> {
    return this.prisma.farm
      .groupBy({
        by: ['state'],
        _count: {
          state: true,
        },
      })
      .then((groups) =>
        groups.map((g) => ({ state: g.state, count: g._count.state })),
      );
  }

  async sumTotalArea(): Promise<number> {
    const result = await this.prisma.farm.aggregate({
      _sum: {
        totalArea: true,
      },
    });
    return result._sum.totalArea || 0;
  }

  async sumBySoilUse(): Promise<{
    arableArea: number;
    vegetationArea: number;
  }> {
    const result = await this.prisma.farm.aggregate({
      _sum: {
        arableArea: true,
        vegetationArea: true,
      },
    });

    return {
      arableArea: result._sum.arableArea || 0,
      vegetationArea: result._sum.vegetationArea || 0,
    };
  }
}
