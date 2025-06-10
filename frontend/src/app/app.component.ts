import { Component } from '@angular/core';
import {Test, TestService} from "./services/test.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  title = 'frontend';
  testValue$: Observable<Test> = this.serviceTest.getTest();

  constructor(private serviceTest: TestService) {
  }
}
