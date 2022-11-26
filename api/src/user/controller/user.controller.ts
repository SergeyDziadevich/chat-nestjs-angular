import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { IUser } from '../model/user.interface';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { ILoginResponse } from '../model/login-response.interface';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    const userEntity: IUser =
      this.userHelperService.createUserDtoToEntity(createUserDto);

    return this.userService.create(userEntity);
  }

  // @UseGuards(JwtAuthGuard) // don't need guard because we check in middleware
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit;

    return this.userService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
  }

  @Get('/find-by-username')
  async findAllByUsername(@Query('username') username: string) {
    return await this.userService.findAllByUsername(username);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<ILoginResponse> {
    const userEntity: IUser =
      this.userHelperService.loginUserDtoToEntity(loginUserDto);
    const jwt: string = await this.userService.login(userEntity);

    return {
      access_token: jwt,
      token_type: 'JWT',
      expires_in: 10000,
    };
  }
}
