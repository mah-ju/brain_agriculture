import { Module, forwardRef } from '@nestjs/common';
import { CropSeasonController } from './crop-season.controller';
import { CropSeasonService } from './crop-season.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FarmModule } from '../farm/farm.module';

@Module({
  imports: [PrismaModule, forwardRef(() => FarmModule)],
  controllers: [CropSeasonController],
  providers: [CropSeasonService],
  exports: [CropSeasonService],
})
export class CropSeasonModule {}
