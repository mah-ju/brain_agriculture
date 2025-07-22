import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { FarmModule } from '../farm/farm.module';
import { PlantedCropModule } from '../planted-crop/planted-crop.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => FarmModule),
    forwardRef(() => PlantedCropModule),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, RolesGuard],
  exports: [AdminService],
})
export class AdminModule {}
