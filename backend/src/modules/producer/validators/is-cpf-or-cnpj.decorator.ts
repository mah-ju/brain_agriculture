import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'isCpfOrCnpj', async: false })
export class IsCpfOrCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: string, _: ValidationArguments) {
    return cpf.isValid(value) || cnpj.isValid(value);
  }

  defaultMessage(_: ValidationArguments) {
    return 'Document must be a valid CPF or CNPJ';
  }
}

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCpfOrCnpj',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsCpfOrCnpjConstraint,
    });
  };
}
