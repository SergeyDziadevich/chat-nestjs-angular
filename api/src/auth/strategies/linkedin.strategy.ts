import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor() {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/linkedin/callback',
      scope: ['email', 'profile', 'openid'],
      state: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void,
  ) {
    try {
      console.log('LinkedIn profile:', profile);

      const user = {
        email: profile?.email,
        name: profile?.name,
        photo: profile?.picture,
        accessToken,
      };

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
}
