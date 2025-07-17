import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto';
import { UpdatePlantedCropDto } from './dto/update-planted-crop.dto';

@Injectable()
export class PlantedCropService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlantedCropDto, userId: number) {
    const cropSeason = await this.prisma.cropSeason.findUnique({
      where: { id: data.cropSeasonId },
      include: { farm: true },
    });
    if (!cropSeason) {
      throw new NotFoundException(
        `Safra com ID ${data.cropSeasonId} não encontrada`,
      );
    }
    if (cropSeason.farm.producerId !== userId) {
      throw new ForbiddenException(
        'Você não pode criar cultura plantada em uma safra de outro produtor',
      );
    }
    return this.prisma.plantedCrop.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.plantedCrop.findMany();
  }

  async findOne(id: number) {
    const plantedCrop = await this.prisma.plantedCrop.findUnique({
      where: { id },
      include: {
        cropSeason: {
          include: {
            farm: true,
          },
        },
      },
    });

    if (!plantedCrop) {
      throw new NotFoundException(
        `Cultura plantada com ID ${id} não encontrada`,
      );
    }

    return plantedCrop;
  }

  async update(id: number, data: UpdatePlantedCropDto, userId: number) {
    const plantedCrop = await this.prisma.plantedCrop.findUnique({
      where: { id },
      include: {
        cropSeason: {
          include: {
            farm: true,
          },
        },
      },
    });

    if (!plantedCrop) {
      throw new NotFoundException(
        `Não é possível atualizar: cultura plantada com ID ${id} não encontrada `,
      );
    }

    if (plantedCrop.cropSeason.farm.producerId !== userId) {
      throw new ForbiddenException('Você não pode atualizar esta cultura');
    }

    return this.prisma.plantedCrop.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number) {
    const plantedCrop = await this.prisma.plantedCrop.findUnique({
      where: { id },
      include: {
        cropSeason: {
          include: {
            farm: true,
          },
        },
      },
    });
    if (!plantedCrop) {
      throw new NotFoundException(
        `Não é posssível excluir: cultura plantada com ID ${id} não encontrada`,
      );
    }
    if (plantedCrop.cropSeason.farm.producerId !== userId) {
      throw new ForbiddenException('Você não pode excluir esta cultura');
    }

    return this.prisma.plantedCrop.delete({
      where: { id },
    });
  }

  async countByPlantedCrops(): Promise<{ name: string; count: number }[]> {
    const result = await this.prisma.plantedCrop.groupBy({
      by: ['name'],
      _count: {
        name: true,
      },
    });

    return result.map((group) => ({
      name: group.name,
      count: group._count.name,
    }));
  }
}
