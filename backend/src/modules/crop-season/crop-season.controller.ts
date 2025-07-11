import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { CropSeasonService } from './crop-season.service';
import { CreateCropSeasonDto } from './dto/create-crop-season.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayloadWithSub } from '../auth/types';
import { UpdateCropSeasonDto } from './dto/update-crop-season.dto';

@Controller('cropseason')
export class CropSeasonController {
  constructor(private readonly cropSeasonService: CropSeasonService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCropSeasonDto: CreateCropSeasonDto) {
    return this.cropSeasonService.create(createCropSeasonDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as JwtPayloadWithSub;
    return this.cropSeasonService.findAll(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cropSeasonService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCropSeasonDto: UpdateCropSeasonDto,
  ) {
    return this.cropSeasonService.update(id, updateCropSeasonDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cropSeasonService.remove(id);
  }
}
