import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async login(user: LoginDto) {

    const userData = await this.userRepository.findOne({ where: { email: user.email } });
    if (!userData) {
      return {
        type: "error",
        message: "User not found"
      };
    }

    const isMatch = await bcrypt.compare(user.password, userData.password);
    if (!isMatch) {
      return {
        type: "error",
        message: "Invalid credentials"
      };
    }

    const payload = { email: userData.email, userId: userData.userId };

    return {
      type: "success",
      data: {
        access_token: this.jwtService.sign(payload, {
          expiresIn: '1d'
        }),
        refresh_token: this.jwtService.sign(payload, {
          expiresIn: '7d'
        }),
        user: {
          email: userData.email,
          userId: userData.userId
        }
      }
    }
  }

  async signup(user: SignupDto) {

    const userData = await this.userRepository.findOne({ where: { email: user.email } });
    if (userData) {
      return {
        type: "error",
        message: "User already exists"
      };
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({ ...user, password: hashedPassword });

    await this.userRepository.save(newUser);

    const payload = { email: user.email, userId: newUser.userId };

    return {
      type: "success",
      data: {
        access_token: this.jwtService.sign(payload, {
          expiresIn: '1d'
        }),
        refresh_token: this.jwtService.sign(payload, {
          expiresIn: '7d'
        }),
        user: {
          email: user.email,
          userId: newUser.userId
        }
      }
    }
  }
}
