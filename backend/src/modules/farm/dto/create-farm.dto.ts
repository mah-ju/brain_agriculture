import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

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

  @IsNumber()
  totalArea: number;

  @IsNumber()
  arableArea: number;

  @IsNumber()
  vegetationArea: number;
}
