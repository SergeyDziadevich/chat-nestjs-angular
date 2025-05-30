import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../../user/model/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: IUser): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  comparePassword(password: string, storedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, storedPassword) as Promise<boolean>;
  }

  verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }

  async loginWithGoogle(user: any) {
    const payload = { email: user.email, sub: user.id };
    const token = await this.generateJwt(payload);

    return {
      access_token: token,
    };
  }
}
