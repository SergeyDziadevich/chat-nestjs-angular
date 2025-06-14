import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import {CustomValidators} from "../../_helpers/custom-validators";
import { UserService } from "../../services/user.service";
import { tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {

  form: FormGroup = new FormGroup(
  {
      email: new FormControl(null, [Validators.required, Validators.email]),
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      passwordConfirm: new FormControl(null, [Validators.required]  )
    },
    { validators: CustomValidators.passwordsMatching }
  );

  constructor(private userService: UserService, private router: Router) { }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get passwordConfirm(): FormControl {
    return this.form.get('passwordConfirm') as FormControl;
  }

  register() {
    if (this.form.valid) {
      this.userService.create({
        email: this.email.value,
        password: this.password.value,
        username: this.username.value,
      }).pipe(tap(() => this.router.navigate(['../login'])))
        .subscribe()
    }
  }

}
