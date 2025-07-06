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
    return this.prisma.producer.findMany({
      include: {
        farms: true,
      },
    });
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
