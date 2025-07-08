import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProducerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProducerDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.producer.create({
      data: { ...data, password: hashedPassword },
    });
  }

  async findAll() {
    const producers = this.prisma.producer.findMany({
      include: {
        farms: {
          include: {
            cropSeasons: {
              include: {
                plantedCrops: true,
              },
            },
          },
        },
      },
    });
    return (await producers).map((producer) => ({
      id: producer.id,
      name: producer.name,
      cpfOrCnpj: producer.cpfOrCnpj,
      farms: producer.farms.map((farm) => ({
        id: farm.id,
        name: farm.name,
        city: farm.city,
        state: farm.state,
        totalArea: farm.totalArea,
        arableArea: farm.arableArea,
        vegetationArea: farm.vegetationArea,
        cropSeasons: farm.cropSeasons.map((season) => ({
          id: season.id,
          year: season.year,
          plantedCrops: season.plantedCrops.map((crop) => ({
            id: crop.id,
            name: crop.name,
          })),
        })),
      })),
    }));
  }

  async findOne(id: number) {
    const producer = await this.prisma.producer.findUnique({
      where: { id },
      include: {
        farms: true,
      },
    });

    if (!producer) {
      throw new NotFoundException(`Produtor com ID ${id} não encontrado`);
    }

    return producer;
  }

  async update(id: number, data: UpdateProducerDto) {
    const producerIdExist = await this.prisma.producer.findUnique({
      where: { id },
    });

    if (!producerIdExist) {
      throw new NotFoundException(
        `Não é possível atualizar: produtor com ID ${id} não encontrado`,
      );
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.producer.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const producerIdDel = await this.prisma.producer.findUnique({
      where: { id },
    });
    if (!producerIdDel) {
      throw new NotFoundException(
        `Não é possível excluir: produtor com ID ${id} não encontrado`,
      );
    }
    return this.prisma.producer.delete({
      where: { id },
    });
  }
}
