import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {
  constructor(private userService: UserService) { }

  subscription!: Subscription
  user!: User
  users!: User[]
  contacts!: User[]

  ngOnInit() {
    this.userService.users$.subscribe(users => {
      this.users = users
      this.setContacts()
    })
  }

  setContacts() {
    this.subscription = this.userService.user$.subscribe(
      (user) => {
        if (user && this.users) {
          this.user = user
          this.contacts = this.users.filter(u => this.user.contacts.find(contact => contact._id === u._id))
        }
      }
    )
  }
}