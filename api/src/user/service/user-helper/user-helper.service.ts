import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../model/dto/create-user.dto';
import { IUser } from '../../model/user.interface';
import { LoginUserDto } from '../../model/dto/login-user.dto';

@Injectable()
export class UserHelperService {
  createUserDtoToEntity(createUserDto: CreateUserDto): IUser {
    return {
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    };
  }

  loginUserDtoToEntity(loginUserDto: LoginUserDto): IUser {
    return {
      email: loginUserDto.email,
      password: loginUserDto.password,
    };
  }
}
