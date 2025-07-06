import { Injectable } from '@nestjs/common';
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
      include: { farm: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.cropSeason.findUnique({
      where: { id },
      include: { farm: true },
    });
  }

  async update(id: number, data: UpdateCropSeasonDto) {
    return this.prisma.cropSeason.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.cropSeason.delete({
      where: { id },
    });
  }
}
