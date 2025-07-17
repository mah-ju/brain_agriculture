import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { FarmModule } from '../farm/farm.module';
import { PlantedCropModule } from '../planted-crop/planted-crop.module';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [forwardRef(() => FarmModule), forwardRef(() => PlantedCropModule)],
  controllers: [AdminController],
  providers: [AdminService, RolesGuard],
})
export class AdminModule {}
