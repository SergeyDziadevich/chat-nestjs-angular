import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, tap } from "rxjs";

import { IUser } from "../../model/user.interface";
import { ILoginResponse } from "../../model/ login-response";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  login(user: IUser): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('api/users/login', user).pipe(
      tap((res) => localStorage.setItem('nestjs_chat_app', res.access_token)),
      tap(() => this.snackbar.open(`Login successful`, 'Close',
        { duration: 3000, horizontalPosition: "right", verticalPosition: "top"}))
    )
  }
}
