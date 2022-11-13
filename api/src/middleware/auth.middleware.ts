import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IUser } from 'src/user/model/user.interface';
import { AuthService } from '../auth/service/auth.service';
import { UserService } from '../user/service/user.service';

export interface RequestModel extends Request {
  user?: IUser;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    console.log('Request...');

    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);

      // check if user is not deleted or right changed while jwt works
      const user: IUser = await this.userService.getOne(decodedToken.user.id);

      if (user) {
        // attach user to request object to access later
        req.user = user;

        next();
      } else {
        throw new HttpException('Unauthorized ', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('Unauthorized ', HttpStatus.UNAUTHORIZED);
    }
  }
}
