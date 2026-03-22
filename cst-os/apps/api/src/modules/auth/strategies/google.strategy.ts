import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID:     config.get<string>('GOOGLE_CLIENT_ID')     || 'not-configured',
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET') || 'not-configured',
      callbackURL:  config.get<string>('GOOGLE_CALLBACK_URL')  ?? 'http://localhost:3001/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const email: string = profile.emails?.[0]?.value ?? '';

    // Domain restriction — only mobileoptima.com and tarkie.com
    const allowedDomains = (
      this.config.get<string>('ALLOWED_DOMAINS') ?? 'mobileoptima.com,tarkie.com'
    ).split(',');

    const domain = email.split('@')[1];
    if (!allowedDomains.includes(domain)) {
      return done(
        new UnauthorizedException(
          `Access denied. Only ${allowedDomains.join(', ')} accounts are allowed.`,
        ),
        false,
      );
    }

    try {
      const user = await this.authService.validateGoogleUser({
        googleId: profile.id,
        email,
        fullName: profile.displayName ?? email,
        profilePhotoUrl: profile.photos?.[0]?.value,
      });
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
