import { IsNotEmpty, IsString } from 'class-validator';
import { IsCpfOrCnpj } from '../validators/is-cpf-or-cnpj.decorator';

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
}
