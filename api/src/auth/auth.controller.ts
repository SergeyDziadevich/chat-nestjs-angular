import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/model/user.entity';
import { Repository } from 'typeorm';

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
    // TODO: Here, you can create the user in the DB if it doesn't exist
    // return req.user.email;
    console.log(' req.user.profile: ', req.user.profile);
    console.log(' req.user.name: ', req.user.name);

    const user = await this.userRepository.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      const newUser = this.userRepository.create({
        email: req.user.email,
        username: req.user.name,
        password: Math.random().toString(36).slice(-8),
        // generate a random 8-character password
        // TODO: Consider using a more secure method for generating passwords
      });
      await this.userRepository.save(newUser);
      console.warn('New user Google OAuth2 created: ', newUser); // log the new user
    }

    const jwt = await this.authService.loginWithGoogle(req.user);
    res.set('Authorization', jwt.access_token);
    res.set(jwt);

    return res.redirect(
      `http://localhost:4200/public/login?token=${jwt.access_token}`,
    );
  }
}
