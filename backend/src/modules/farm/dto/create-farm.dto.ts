import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Min,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';

interface FarmAreaFields {
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
}

@ValidatorConstraint({ name: 'areaSum', async: false })
class AreaSumConstraint implements ValidatorConstraintInterface {
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
  @Type(() => Number)
  @Min(0)
  state: string;

  @IsNotEmpty()
  @IsNumber()
  totalArea: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  arableArea: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  vegetationArea: number;

  @Validate(AreaSumConstraint)
  checkAreas: boolean;
}
