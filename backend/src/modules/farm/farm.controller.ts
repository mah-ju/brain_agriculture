import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayloadWithSub } from '../auth/types';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createFarmDto: CreateFarmDto, @Req() req: Request) {
    const user = req.user as JwtPayloadWithSub;
    const producerId = user.sub;
    return this.farmService.create(createFarmDto, producerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as JwtPayloadWithSub;
    const producerId = user.sub;
    return this.farmService.findAll(producerId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOnde(@Param('id') id: string) {
    return this.farmService.findOnde(+id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmService.remove(+id);
  }
}
