import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, tap } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";

import { IUser } from "../../model/user.interface";
import { ILoginResponse } from "../../model/login-response";
import { CustomSocket } from "../../private/sockets/custom-socket";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient, 
    private snackbar: MatSnackBar, 
    private jwtService: JwtHelperService,
    private socket: CustomSocket,
    private router: Router
  ) { }

  login(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('api/users/login', user).pipe(
      tap((res) => {
        localStorage.setItem('nestjs_chat_app', res.access_token);
        this.socket.reconnect();
      }),
      tap(() => this.snackbar.open(`Login successful`, 'Close',
        { duration: 3000, horizontalPosition: "right", verticalPosition: "top"}))
    )
  }

  logout() {
    localStorage.removeItem('nestjs_chat_app');
    this.socket.disconnect();
    this.router.navigate(['/public/login']);
    this.snackbar.open('Logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top"
    });
  }

  getLoggedInUser(): IUser {
    const decodedToken = this.jwtService.decodeToken();

    return {
      ...decodedToken.user,
      username: decodedToken.username || decodedToken.user.username || decodedToken.user.email
    };
  }
}
