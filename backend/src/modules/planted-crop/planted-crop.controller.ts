import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PlantedCropService } from './planted-crop.service';
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePlantedCropDto } from './dto/update-planted-crop.dto';

@Controller('plantedcrop')
export class PlantedCropController {
  constructor(private readonly plantedCropService: PlantedCropService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPlantedCropDto: CreatePlantedCropDto) {
    return this.plantedCropService.create(createPlantedCropDto);
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
  ) {
    return this.plantedCropService.update(id, updatePlantedCropDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.plantedCropService.remove(id);
  }
}
