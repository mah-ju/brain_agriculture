import { Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProducerController],
  providers: [ProducerService],
})
export class ProducerModule {}
