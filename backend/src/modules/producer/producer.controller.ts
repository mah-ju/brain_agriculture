import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Get,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';

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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.producerService.findOne(id);
  }
}
