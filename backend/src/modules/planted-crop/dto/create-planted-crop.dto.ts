import { IsNotEmpty, IsString, IsInt } from 'class-validator';
export class CreatePlantedCropDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  cropSeasonId: number;
}
