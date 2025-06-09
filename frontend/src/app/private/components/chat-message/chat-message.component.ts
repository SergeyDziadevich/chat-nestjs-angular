import { Component, Input } from '@angular/core';

import { IMessage } from "../../../model/message.interace";
import { IUser } from "../../../model/user.interface";
import { AuthService } from "../../../public/services/auth.service";

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  standalone: false
})
export class ChatMessageComponent {
  @Input() message: IMessage;
  user: IUser = this.authService.getLoggedInUser()

  constructor(private authService: AuthService) { }
}
