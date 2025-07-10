import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCropSeasonDto } from './dto/create-crop-season.dto';
import { UpdateCropSeasonDto } from './dto/update-crop-season.dto';

@Injectable()
export class CropSeasonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCropSeasonDto) {
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

  async update(id: number, data: UpdateCropSeasonDto) {
    const cropSeasonId = await this.prisma.cropSeason.findUnique({
      where: { id },
    });

    if (!cropSeasonId) {
      throw new NotFoundException(
        `Não é possível atualizar: safra com ID ${id} não encontrada`,
      );
    }

    return this.prisma.cropSeason.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const cropSeasonId = await this.prisma.cropSeason.findUnique({
      where: { id },
    });

    if (!cropSeasonId) {
      throw new NotFoundException(
        `Não é possível excluir: safra com ID ${id} não encontrada`,
      );
    }

    return this.prisma.cropSeason.delete({
      where: { id },
    });
  }
}
