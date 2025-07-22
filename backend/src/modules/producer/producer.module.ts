import { Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProducerController],
  providers: [ProducerService, RolesGuard],
  exports: [ProducerService],
})
export class ProducerModule {}
