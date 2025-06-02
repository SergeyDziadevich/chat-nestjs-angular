import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from '../model/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/user.entity';
import { Like, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from '../../auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async create(newUser: IUser): Promise<IUser> {
    try {
      const exists: boolean = await this.emailExists(newUser.email);
      if (!exists) {
        const passwordHash: string = await this.hashPassword(newUser.password);
        newUser.password = passwordHash;
        const user = await this.userRepository.save(
          this.userRepository.create(newUser),
        );
        return this.findOne(user.id);
      } else {
        throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
      }
    } catch {
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<IUser>> {
    return paginate<UserEntity>(this.userRepository, options);
  }

  async login(user: IUser): Promise<string> {
    try {
      const foundUser: IUser = await this.findByEmail(user.email.toLowerCase());

      if (foundUser) {
        const matches: boolean = await this.validatePassword(
          user.password,
          foundUser.password,
        );

        if (matches) {
          const payload: IUser = await this.findOne(foundUser.id);
          console.log("payload", payload);
          return this.authService.generateJwt(payload);
        } else {
          throw new HttpException(
            'Login was not successful, wrong credentials',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new HttpException(
          'Login was not successful, wrong credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  findAllByUsername(username: string): Promise<IUser[]> {
    return this.userRepository.find({
      where: { username: Like(`%${username.toLowerCase()}`) },
    });
  }

  getOne(id: number): Promise<IUser> {
    return this.userRepository.findOneOrFail({
      where: { id },
    });
  }

  // also return the password
  private async findByEmail(email: string): Promise<IUser> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password'],
    });
  }

  private async findOne(id: number): Promise<IUser> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  private async validatePassword(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    return this.authService.comparePassword(password, storedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  private async emailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      return true;
    } else {
      return false;
    }
  }
}
