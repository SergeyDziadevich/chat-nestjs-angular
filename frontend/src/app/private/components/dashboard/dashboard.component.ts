import { Component } from '@angular/core';
import { ChatService } from "../../services/chat-service/chat.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  message$: Observable<unknown> = this.chatService.getMessage();

  constructor(private chatService: ChatService) { }


}
