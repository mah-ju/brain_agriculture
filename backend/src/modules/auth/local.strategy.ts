import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'cpfOrCnpj',
      passwordField: 'password',
    });
  }

  async validate(cpfOrCnpj: string, password: string) {
    return this.authService.validateUser(cpfOrCnpj, password);
  }
}
