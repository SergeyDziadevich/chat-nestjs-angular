import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from '../model/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/user.entity';
import { Repository } from 'typeorm';
import { from, map, mapTo, Observable, of, switchMap } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { matches } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(newUser: IUser): Observable<IUser> {
    return this.emailExists(newUser.email).pipe(
      switchMap((userExists: boolean) => {
        if (!userExists) {
          return from(this.hashPassword(newUser.password)).pipe(
            switchMap((passwordHash: string) => {
              newUser.password = passwordHash;
              return from(this.userRepository.save(newUser)).pipe(
                switchMap((user: IUser) => this.findOne(user.id)),
              );
            }),
          );
        } else {
          throw new HttpException('Email already exists', HttpStatus.CONFLICT);
        }
      }),
    );
  }

  findAll(options: IPaginationOptions): Observable<Pagination<IUser>> {
    return from(paginate<UserEntity>(this.userRepository, options));
  }

  // TODO: change to JWT
  login(user: IUser): Observable<boolean> {
    return this.findByEmail(user.email).pipe(
      switchMap((foundUser: IUser) => {
        if (foundUser) {
          return this.validatePassword(user.password, foundUser.password).pipe(
            switchMap((matches: boolean) => {
              if (matches) {
                return of(true);
              } else {
                throw new HttpException(
                  'Login was not succesfull, wrong credentials',
                  HttpStatus.UNAUTHORIZED,
                );
              }
            }),
          );
        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      }),
    );
  }

  private validatePassword(
    password: string,
    storedPassword: string,
  ): Observable<boolean> {
    return from(bcrypt.compare(password, storedPassword) as Promise<boolean>);
  }

  // also return the password
  private findByEmail(email: string): Observable<IUser> {
    return from(
      this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'username', 'password'],
      }),
    );
  }

  private async findOne(id: number): Promise<IUser> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  private emailExists(email: string): Observable<boolean> {
    return from(
      this.userRepository.findOne({
        where: { email },
      }),
    ).pipe(map((user: IUser) => !!user));
  }
}
