import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  googleAuth() {
    // Passport redirects automatically
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const { accessToken } = this.authService.login(user);

    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3002';

    // Redirect to frontend with token in query param (frontend stores in memory/cookie)
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  getMe(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout (client-side token invalidation)' })
  logout() {
    // JWT is stateless — client discards token
    // For server-side invalidation, implement a token blocklist via Redis
    return { message: 'Logged out. Please discard your token.' };
  }
}
