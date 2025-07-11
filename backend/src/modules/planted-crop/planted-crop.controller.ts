import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PlantedCropService } from './planted-crop.service';
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePlantedCropDto } from './dto/update-planted-crop.dto';
import { JwtPayloadWithSub } from '../auth/types';
import { Request } from 'express';

@Controller('plantedcrop')
export class PlantedCropController {
  constructor(private readonly plantedCropService: PlantedCropService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createPlantedCropDto: CreatePlantedCropDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayloadWithSub;
    return this.plantedCropService.create(createPlantedCropDto, user.sub);
  }

  @Get()
  findAll() {
    return this.plantedCropService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plantedCropService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlantedCropDto: UpdatePlantedCropDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayloadWithSub;
    return this.plantedCropService.update(id, updatePlantedCropDto, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as JwtPayloadWithSub;
    return this.plantedCropService.remove(id, user.sub);
  }
}
