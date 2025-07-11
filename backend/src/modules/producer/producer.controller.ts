import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Get,
  Req,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayloadWithSub } from '../auth/types';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producerService.create(createProducerDto);
  }

  @Get()
  findAll() {
    return this.producerService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.producerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProducerDto: UpdateProducerDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtPayloadWithSub;
    return this.producerService.update(id, updateProducerDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  removeOwn(@Req() req: Request) {
    const user = req.user as JwtPayloadWithSub;
    return this.producerService.removeOwnProducer(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.producerService.remove(id);
  }
}

//feat: add Helmet and restrict cropSeason/plantedCrop access