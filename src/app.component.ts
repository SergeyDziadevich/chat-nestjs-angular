import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // ...existing code...

  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/auth/google';
  }
}
