import { forwardRef, Module } from '@nestjs/common';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { AdminModule } from '../admin/admin.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [forwardRef(() => AdminModule), PrismaModule],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [FarmService],
})
export class FarmModule {}
