import { IsNotEmpty, IsInt } from 'class-validator';
export class CreateCropSeasonDto {
  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsNotEmpty()
  @IsInt()
  farmId: number;
}
