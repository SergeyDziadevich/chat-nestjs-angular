import { Component  } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import { IUser } from "../../../model/user.interface";
import { ChatService } from "../../services/chat-service/chat.service";

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
  standalone: false
})
export class CreateRoomComponent {
  form: FormGroup = new FormGroup<any>({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    users: new FormArray([], [Validators.required])
  });

  constructor(private chatService: ChatService, private router: Router, private activatedRoute: ActivatedRoute) { }

  get name(): FormControl   {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get users(): FormArray {
    return this.form.get('users') as FormArray;
  }

  initUser(user: IUser): FormControl {
    return new FormControl({
      id: user.id,
      username: user.username,
      email: user.email
    })
  }

  addUser(userFormControl: FormControl): void {
    this.users.push(userFormControl);
  }

  removeUser(userId: any) {
    this.users.removeAt(this.users.value.findIndex((user: IUser) => user.id === userId));
  }

  create() {
    if (this.form.valid) {
      this.chatService.createRoom(this.form.getRawValue());
      this.router.navigate(['../dashboard'], {relativeTo: this.activatedRoute})
    }
  }
}
