import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IUser } from "../../../model/user.interface";
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UserService } from "../../../public/services/user.service";

@Component({
  selector: 'app-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.scss'],
  standalone: false
})
export class SelectUsersComponent implements OnInit, OnDestroy {
  searchUsername = new FormControl();
  filteredUsers: IUser[] = [];
  selectedUser: IUser | null = null;
  @Input() users: IUser[] = [];
  @Output() addUser: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() removeUser: EventEmitter<IUser> = new EventEmitter<IUser>();
  private destroy$ = new Subject();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.searchUsername.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((username:string) => this.userService.findByUsername(username)),
      tap((users: IUser[]) => this.filteredUsers = users)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  displayFn(user: IUser): string {
    if(user && user.username !== undefined) {
      return user.username.toString();
    } else {
      return ''
    }
  }

  setSelectedUser(user: IUser) {
    this.selectedUser = user;
  }

  addUserToForm() {
    if (this.selectedUser) {
      this.addUser.emit(this.selectedUser);
      this.filteredUsers = [];
      this.selectedUser = null;
      this.searchUsername.setValue(null);
    }
  }

  removeUserFromForm(user: IUser) {
    this.removeUser.emit(user);
  }
}

