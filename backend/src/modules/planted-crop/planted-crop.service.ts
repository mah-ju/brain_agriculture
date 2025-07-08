import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto';
import { UpdatePlantedCropDto } from './dto/update-planted-crop.dto';

@Injectable()
export class PlantedCropService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlantedCropDto) {
    return this.prisma.plantedCrop.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.plantedCrop.findMany();
  }

  async findOne(id: number) {
    const plantedCropId = await this.prisma.plantedCrop.findUnique({
      where: { id },
      include: {
        cropSeason: {
          include: {
            farm: true,
          },
        },
      },
    });

    if (!plantedCropId) {
      throw new NotFoundException(
        `Cultura plantada com ID ${id} não encontrada`,
      );
    }

    return plantedCropId;
  }

  async update(id: number, data: UpdatePlantedCropDto) {
    const plantedCrop = await this.prisma.plantedCrop.update({
      where: { id },
      data,
    });

    if (!plantedCrop) {
      throw new NotFoundException(
        `Não é possível atualizar: cultura plantada com ID ${id} não encontrada `,
      );
    }

    return plantedCrop;
  }

  async remove(id: number) {
    const plantedCropDel = await this.prisma.plantedCrop.findUnique({
      where: { id },
    });
    if (!plantedCropDel) {
      throw new NotFoundException(
        `Não é posssível excluir: cultura plantada com ID ${id} não encontrada`,
      );
    }
    return this.prisma.plantedCrop.delete({
      where: { id },
    });
  }
}
