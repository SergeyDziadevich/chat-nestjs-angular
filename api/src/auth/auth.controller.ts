import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    // handles the Google OAuth2 callback
    // TODO: Here, you can create the user in the DB if it doesn't exist
    // return req.user.email;

    const jwt = await this.authService.loginWithGoogle(req.user);
    return res.redirect(
      `http://localhost:4200/public/login?token=${jwt.access_token}`,
    );
  }
}
