import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";

import { IRoomPaginate } from '../../../model/room.interface';
import { ChatService } from "../../services/chat-service/chat.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  rooms$: Observable<IRoomPaginate> = this.chatService.getMyRooms();

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.createRoom();
  }
}

