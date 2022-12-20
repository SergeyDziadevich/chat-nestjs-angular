import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import { IRoom } from "../../../model/room.interface";
import { map, Observable } from "rxjs";
import { IMessagePaginate } from "../../../model/message.interace";
import { ChatService } from "../../services/chat-service/chat.service";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnChanges, OnDestroy {
  @Input() chatRoom: IRoom;

  messages$: Observable<IMessagePaginate> = this.chatService.getMessages().pipe(
    map((messagePaginate: IMessagePaginate) => {
      const items = messagePaginate.items.sort((a, b) =>
        new Date(a.created_at as Date).getTime() -  new Date(b.created_at as Date).getTime())

      messagePaginate.items = items;

      return messagePaginate
    })
  );

  chatMessage: FormControl = new FormControl(null, [Validators.required]);


  constructor(private chatService: ChatService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.chatService.leaveRoom(changes['chatRoom']?.previousValue);

    if (this.chatRoom) {
      this.chatService.joinRoom(this.chatRoom);
    }
  }

  ngOnDestroy(): void {
    this.chatService.leaveRoom(this.chatRoom)
  }

  sendMessage() {
    this.chatService.sentMessage({text: this.chatMessage.value, room: this.chatRoom});
    this.chatMessage.reset();
  }
}
