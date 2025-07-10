import { PartialType } from '@nestjs/mapped-types';
import { CreateFarmDto } from './create-farm.dto';
import { Validate } from 'class-validator';
import { AreaSumConstraint } from './create-farm.dto';

export class UpdateFarmDto extends PartialType(CreateFarmDto) {
  @Validate(AreaSumConstraint)
  checkAreas?: boolean;
}
