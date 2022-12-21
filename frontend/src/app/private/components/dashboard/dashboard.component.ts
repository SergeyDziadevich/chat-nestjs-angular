import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Observable } from "rxjs";
import { MatSelectionListChange } from "@angular/material/list";
import { PageEvent } from "@angular/material/paginator";

import { IRoomPaginate } from '../../../model/room.interface';
import { ChatService } from "../../services/chat-service/chat.service";
import { IUser } from "../../../model/user.interface";
import { AuthService } from "../../../public/services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  selectedRoom = null;
  rooms$: Observable<IRoomPaginate> = this.chatService.getMyRooms();
  user: IUser = this.authService.getLoggedInUser();

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit(): void {
    this.chatService.emitPaginateRooms(10, 0);
  }

  ngAfterViewInit(): void {
    this.chatService.emitPaginateRooms(10, 0);
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }
}

