import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { IsCpfOrCnpj } from '../validators/is-cpf-or-cnpj.decorator';
import { Role } from '@prisma/client';

export class CreateProducerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsCpfOrCnpj({ message: 'CPF ou CNPJ inválido' })
  cpfOrCnpj: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
