import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { combineLatest, map, Observable, startWith, tap } from "rxjs";

import { IRoom } from "../../../model/room.interface";
import { IMessagePaginate } from "../../../model/message.interace";
import { ChatService } from "../../services/chat-service/chat.service";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('messages') private messagesScroller: ElementRef;
  @Input() chatRoom: IRoom;

  messagesPaginate$: Observable<IMessagePaginate> = combineLatest([this.chatService.getMessages(), this.chatService.getAddedMessage().pipe(startWith(null))]).pipe(
    map(([messagePaginate, message]) => {
      if (message && message?.room?.id === this.chatRoom.id && !messagePaginate.items.some(m => m.id === message.id)) {
        messagePaginate.items.push(message);
      }
      console.log("messagesPaginate$", messagePaginate.items);
      // @ts-ignore
      const items = messagePaginate.items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      messagePaginate.items = items;
      return messagePaginate;
    }),
    tap(() => this.scrollToBottom())
  )

  chatMessage: FormControl = new FormControl(null, [Validators.required]);


  constructor(private chatService: ChatService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.chatService.leaveRoom(changes['chatRoom']?.previousValue);

    if (this.chatRoom) {
      this.chatService.joinRoom(this.chatRoom);
    }
  }

  ngAfterViewInit(): void {
     this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.chatService.leaveRoom(this.chatRoom)
  }

  sendMessage() {
    this.chatService.sentMessage({text: this.chatMessage.value, room: this.chatRoom});
    this.chatMessage.reset();
  }

  scrollToBottom(): void {
    setTimeout(() => this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight, 0)
  }


}
