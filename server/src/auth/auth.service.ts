import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService) {}

  async login(user: LoginDto) {
    const payload = { email: user.email };
    return {
      type: "success",
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1d'
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d'
      }),
    };
  }

  async signup(user: SignupDto) {
    const payload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1d'
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d'
      }),
    };
  }
}
