import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { map, Observable, switchMap } from 'rxjs';
import { IUser } from '../model/user.interface';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { ILoginResponse } from '../model/login-response.interface';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<unknown> {
    return this.userHelperService
      .createUserDtoToEntity(createUserDto)
      .pipe(switchMap((user: IUser) => this.userService.create(user)));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Observable<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit;

    return this.userService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Observable<ILoginResponse> {
    return this.userHelperService.loginUserDtoToEntity(loginUserDto).pipe(
      switchMap((user: IUser) =>
        this.userService.login(user).pipe(
          map((jwt: string) => ({
            access_token: jwt,
            token_type: 'JWT',
            expires_in: 10000,
          })),
        ),
      ),
    );
  }
}
