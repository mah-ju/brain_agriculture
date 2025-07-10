import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';

interface FarmAreaFields {
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
}

@ValidatorConstraint({ name: 'areaSum', async: false })
export class AreaSumConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const { totalArea, arableArea, vegetationArea } =
      args.object as FarmAreaFields;
    return (
      typeof totalArea === 'number' &&
      typeof arableArea === 'number' &&
      typeof vegetationArea === 'number' &&
      arableArea + vegetationArea <= totalArea
    );
  }
  defaultMessage(_: ValidationArguments) {
    return 'A soma da área agricultável e de vegetação não pode ser maior que a área total. ';
  }
}

export class CreateFarmDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  totalArea: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  arableArea: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  vegetationArea: number;

  @Validate(AreaSumConstraint)
  checkAreas: boolean;
}
