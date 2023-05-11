import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { lastValueFrom, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  subscription!: Subscription
  contactId: string | null = null
  contact!: any
  user!: User
  users!: User[]
  contacts!: User[]

  ngOnInit() {
    this.loadUsers()
    this.loadContactsAndUser()
    this.loadContact()
  }

  loadUsers() {
    this.userService.users$.subscribe(users => {
      this.users = users
    })
  }

  loadContactsAndUser() {
    this.subscription = this.userService.user$.subscribe(
      (user) => {
        if (user && this.users) {
          this.user = user
          this.contacts = this.users.filter(u => user.contacts.find(contact => contact._id === u._id))
        }
      }
    )
  }

  loadContact() {
    this.route.params.subscribe({
      next: async params => {
        this.contactId = params['id']
        let contact!: any
        if (this.contactId) contact = await lastValueFrom(this.userService.getById(this.contactId))
        else contact = this.userService.getEmptyContact()
        this.contact = contact
      },
      error: err => console.log('err:', err)
    })
  }

  onBack(): void {
    this.location.back();
  }

  onSaveContact(ev: Event) {
    ev.preventDefault()
    const contactToSave = this.contact
    if (!this.contactId) {
      if (!this.users.find(u => u.phone === contactToSave.phone)) {
        console.log('This contact do not using this app, but you can to invite him')
        return
      }
      let similarContact!: User
      if (this.contacts.find(c => {
        similarContact = c
        return c.phone === contactToSave.phone
      })) {
        console.log(`you already have this contact number in your contacts list in ${similarContact.name}`)
        //you have this contact number in your contacts list(maybe show where...)
        return
      }
    } else {
      let similarContact!: User
      if (this.user && this.users.find(u => {
        similarContact = u
        return u.phone === contactToSave.phone
      }) && similarContact._id !== this.user._id) {
        console.log(`This number already use the app by the name:${similarContact.name}`)
        //you have this contact number in your contacts list(maybe show where...)
        return
      }
    }
    this.userService.save(contactToSave)
    this.location.back();
  }
}