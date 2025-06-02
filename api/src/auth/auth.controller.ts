import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/model/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    // handles the Google OAuth2 callback
    console.log(' req.user: ', JSON.stringify(req.user));

    const user = await this.userRepository.findOne({
      where: { email: req.user.email },
    });
    const userName = await this.userRepository.findOneBy({
      username: req.user.name,
    });

    if (!user) {
      if (userName) {
        console.warn(`User with this ${req.user.name} already exists.`);
      }
      const generatedPassword = Math.random().toString(36).slice(-8);
      const passwordHash = await bcrypt.hash(generatedPassword, 12);
      const newUser = this.userRepository.create({
        email: req.user.email,
        username: userName
          ? `${req.user.name}-${req.user.email}`
          : req.user.name,
        password: passwordHash,
        photo: req.user.photo,
      });
      await this.userRepository.save(newUser);
      console.warn('New user Google OAuth2 created: ', newUser); // log the new user
    }

    const jwt = await this.authService.loginWithGoogle(req.user);
    // res.set('Authorization', `Bearer ${jwt.access_token}`);

    return res.redirect(
      `http://localhost:4200/public/login?token=${encodeURIComponent(
        jwt.access_token,
      )}`,
    );
  }

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth(@Req() req) {
    // initiates the LinkedIn OAuth2 login flow
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthCallback(@Req() req, @Res() res) {
    // handles the LinkedIn OAuth2 callback
    console.log(' req.user: ', JSON.stringify(req.user));

    const user = await this.userRepository.findOne({
      where: { email: req.user.email },
    });
    const userName = await this.userRepository.findOneBy({
      username: req.user.name,
    });

    if (!user) {
      if (userName) {
        console.warn(`User with this ${req.user.name} already exists.`);
      }
      const generatedPassword = Math.random().toString(36).slice(-8);
      const passwordHash = await bcrypt.hash(generatedPassword, 12);
      const newUser = this.userRepository.create({
        email: req.user.email,
        username: userName
          ? `${req.user.name}-${req.user.email}`
          : req.user.name,
        password: passwordHash,
        photo: req.user.photo,
      });
      await this.userRepository.save(newUser);
      console.warn('New user LinkedIn OAuth2 created: ', newUser);
    }

    const jwt = await this.authService.loginWithGoogle(req.user);

    return res.redirect(
      `http://localhost:4200/public/login?token=${encodeURIComponent(
        jwt.access_token,
      )}`,
    );
  }
}
