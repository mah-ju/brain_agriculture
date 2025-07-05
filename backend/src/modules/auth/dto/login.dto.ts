import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  cpfOrCnpj: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
