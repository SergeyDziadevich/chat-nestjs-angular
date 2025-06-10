import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Observable, tap } from "rxjs";
import { MatSelectionList, MatSelectionListChange } from "@angular/material/list";
import { PageEvent } from "@angular/material/paginator";

import { IRoom, IRoomPaginate } from '../../../model/room.interface';
import { ChatService } from "../../services/chat-service/chat.service";
import { IUser } from "../../../model/user.interface";
import { AuthService } from "../../../public/services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSelectionList) roomList!: MatSelectionList;
  selectedRoom: null | IRoom = null;
  rooms$: Observable<IRoomPaginate> = this.chatService.getMyRooms().pipe(
    tap(roomsData => this.setDefaultRoom(roomsData)));
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

  logout() {
    this.authService.logout();
  }

  private setDefaultRoom(roomsData: IRoomPaginate) {
    if (roomsData?.items?.length > 0) {
      // Set the first room as selected by default
      this.selectedRoom = roomsData.items[0];

      // Need to wait for options to be rendered
      setTimeout(() => {
        if (this.roomList && this.roomList.options.length > 0) {
          this.roomList.options.first.selected = true;
        }
      });
    }
  }
}

