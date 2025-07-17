import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayloadWithSub } from '../auth/types';

@Injectable()
export class ProducerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProducerDto) {
    const existing = await this.prisma.producer.findUnique({
      where: { cpfOrCnpj: data.cpfOrCnpj },
    });

    if (existing) {
      throw new ConflictException('CPF ou CNPJ já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.producer.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || 'PRODUCER',
      },
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

  async update(id: number, data: UpdateProducerDto, user: JwtPayloadWithSub) {
    const producer = await this.prisma.producer.findUnique({
      where: { id },
    });

    if (!producer) {
      throw new NotFoundException(
        `Não é possível atualizar: produtor com ID ${id} não encontrado`,
      );
    }

    if (user.role !== 'ADMIN' && producer.id !== user.sub) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar essa fazenda',
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

  async removeOwnProducer(id: number) {
    const producer = await this.prisma.producer.findUnique({ where: { id } });
    if (!producer) {
      throw new NotFoundException(`Produtor com ID ${id} não encontrado`);
    }

    return this.prisma.producer.delete({
      where: { id },
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
