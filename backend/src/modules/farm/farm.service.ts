import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

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

  async findOnde(id: number) {
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

  async update(id: number, data: UpdateFarmDto) {
    const { totalArea, arableArea, vegetationArea } = data;

    if (
      typeof totalArea === 'number' &&
      typeof arableArea === 'number' &&
      typeof vegetationArea === 'number' &&
      arableArea + vegetationArea <= totalArea
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

  async remove(id: number) {
    const farm = await this.prisma.farm.findUnique({ where: { id } });

    if (!farm) {
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada`);
    }

    return this.prisma.farm.delete({ where: { id } });
  }
}
