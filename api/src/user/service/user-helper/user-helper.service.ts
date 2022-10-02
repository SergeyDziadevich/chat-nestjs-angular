import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../model/dto/create-user.dto';
import { Observable, of } from 'rxjs';
import { IUser } from '../../model/user.interface';
import { LoginUserDto } from '../../model/dto/login-user.dto';

@Injectable()
export class UserHelperService {
  createUserDtoToEntity(createUserDto: CreateUserDto): Observable<IUser> {
    return of({
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    });
  }

  loginUserDtoToEntity(loginUserDto: LoginUserDto): Observable<IUser> {
    return of({
      email: loginUserDto.email,
      password: loginUserDto.password,
    });
  }
}
