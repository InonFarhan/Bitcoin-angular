import { Component } from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Move } from 'src/app/models/move.model';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  subscription!: Subscription
  user!: User
  contact!: User
  moves!: Move[]

  ngOnInit() {
    this.subscription = this.userService.user$.subscribe(
      (user) => {
        if (user) {
          this.user = user
          this.setContact()
        }
      }
    )
  }

  setContact() {
    this.route.params.subscribe({
      next: async params => {
        const contactId = params['id']
        const contact = await lastValueFrom(this.userService.getById(contactId))
        this.contact = contact
        if (this.user && this.user.moves.length && this.contact) {
          this.moves = this.user.moves.filter(m => m.toId === this.contact._id)
        }
      },
      error: err => console.log('err:', err)
    })
  }

  onBack(): void {
    this.location.back();
  }

  onDelete(): void {
    if (this.contact) this.userService.removeContact(this.contact._id)
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}