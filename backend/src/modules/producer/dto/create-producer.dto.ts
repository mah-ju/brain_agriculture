import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateProducerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(/^(\d{11}|\d{14})$/, {
    message: 'Document must be a valid CPF or CNPJ',
  })
  cpfOrCnpj: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
