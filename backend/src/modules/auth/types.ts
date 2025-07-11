export type JwtPayloadWithSub = {
  sub: number;
  cpfOrCnpj: string;
  role: 'ADMIN' | 'PRODUCER';
};
