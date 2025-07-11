import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Producer } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(cpfOrCnpj: string, password: string): Promise<Producer> {
    const user = await this.usersService.findByCpfOrCnpj(cpfOrCnpj);
    if (!user) throw new UnauthorizedException('CPF/CNPJ não encontrado');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida');
    }
    return user;
  }

  async signIn(
    cpfOrCnpj: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.validateUser(cpfOrCnpj, password);
    const payload = {
      sub: user.id,
      cpfOrCnpj: user.cpfOrCnpj,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async generateToken(user: Producer): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
      cpfOrCnpj: user.cpfOrCnpj,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
