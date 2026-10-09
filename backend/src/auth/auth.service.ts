import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './payload';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: { sub: number; email: string }): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }
}
