import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCropSeasonDto } from './dto/create-crop-season.dto';
import { UpdateCropSeasonDto } from './dto/update-crop-season.dto';

@Injectable()
export class CropSeasonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCropSeasonDto, userId: number) {
    const farm = await this.prisma.farm.findUnique({
      where: { id: data.farmId },
    });

    if (!farm) {
      throw new NotFoundException(
        `Fazenda com ID ${data.farmId} não encontrada`,
      );
    }
    if (farm.producerId !== userId) {
      throw new ForbiddenException(
        'Você não pode criar safras para essa fazenda',
      );
    }
    return this.prisma.cropSeason.create({
      data,
    });
  }
  async findAll(producerId: number) {
    return this.prisma.cropSeason.findMany({
      where: {
        farm: {
          producerId,
        },
      },
      orderBy: { year: 'desc' },
      include: {
        plantedCrops: {
          select: {
            name: true,
          },
        },
        farm: true,
      },
    });
  }

  async findOne(id: number) {
    const cropSeason = await this.prisma.cropSeason.findUnique({
      where: { id },
      include: { farm: true },
    });

    if (!cropSeason) {
      throw new NotFoundException(`Safra com ID ${id} não encontrada`);
    }
    return cropSeason;
  }

  async update(id: number, data: UpdateCropSeasonDto, userId: number) {
    const cropSeason = await this.prisma.cropSeason.findUnique({
      where: { id },
      include: { farm: true },
    });

    if (!cropSeason) {
      throw new NotFoundException(
        `Não é possível atualizar: safra com ID ${id} não encontrada`,
      );
    }
    if (cropSeason.farm.producerId !== userId) {
      throw new ForbiddenException('Você não pode atualizar esta safra');
    }

    return this.prisma.cropSeason.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number) {
    const cropSeason = await this.prisma.cropSeason.findUnique({
      where: { id },
      include: { farm: true },
    });

    if (!cropSeason) {
      throw new NotFoundException(
        `Não é possível excluir: safra com ID ${id} não encontrada`,
      );
    }
    if (cropSeason.farm.producerId !== userId) {
      throw new ForbiddenException('Você não pode deletar esta safra');
    }

    return this.prisma.cropSeason.delete({
      where: { id },
    });
  }
}
