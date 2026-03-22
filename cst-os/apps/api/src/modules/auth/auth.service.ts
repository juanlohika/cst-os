import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile: {
    googleId: string;
    email: string;
    fullName: string;
    profilePhotoUrl?: string;
  }) {
    return this.usersService.upsertFromGoogle(profile);
  }

  login(user: { id: string; email: string; role: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async getProfile(userId: string) {
    return this.usersService.findOne(userId);
  }
}
