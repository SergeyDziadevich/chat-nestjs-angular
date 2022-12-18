import { Component, Input } from '@angular/core';
import { IMessage } from "../../../model/message.interace";

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {
  @Input() message: IMessage;

  constructor() { }
}
