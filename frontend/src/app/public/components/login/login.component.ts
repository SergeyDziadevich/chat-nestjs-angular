import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import { tap } from 'rxjs';

import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements  OnInit {
  form: FormGroup = new FormGroup<any>({
    email:  new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required])
  })

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // @ts-ignore
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('nestjs_chat_app',  token)
        // Optionally redirect to a protected page
        this.router.navigate(['../../private/dashboard'])
      }
    });
  }

  login(): void {
    if (this.form.valid) {
      this.auth.login({
          email: this.form.get('email')?.value,
          password: this.form.get('password')?.value
        }).pipe(
          tap(() => this.router.navigate(['../../private/dashboard']))
        ).subscribe();
    }
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }
}
