import { Injectable } from '@nestjs/common';
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
        farms: true,
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
      })),
    }));
  }

  async findOne(id: number) {
    return this.prisma.producer.findUnique({
      where: { id },
      include: {
        farms: true,
      },
    });
  }

  async update(id: number, data: UpdateProducerDto) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.producer.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.producer.delete({
      where: { id },
    });
  }
}

/*  async remove(id: number) {
    const farm = await this.prisma.farm.findUnique({ where: { id } });

    if (!farm) {
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada`);
    }

    return this.prisma.farm.delete({ where: { id } });
  } */
