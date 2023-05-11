import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { BitcoinService } from 'src/app/services/bitcoin.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnDestroy {

  constructor(
    private userService: UserService,
    private bitcoinService: BitcoinService,
    private router: Router,
  ) { }
  subscription!: Subscription
  users!: User[]
  user!: User
  btc!: number
  contacts!: User[]

  ngOnInit() {
    this.userService.users$.subscribe(users => {
      this.users = users
    })

    this.subscription = this.userService.user$.subscribe(
      (user) => {
        if (user && this.users) {
          this.user = user
          this.bitcoinService.loadUserRate(user)
          this.contacts = this.users.filter(u => user.contacts.find(contact => contact._id === u._id))
        } else this.router.navigateByUrl('/userConnecting')
      }
    )

    this.bitcoinService.rate$.subscribe(rate => {
      if (rate) this.btc = +rate
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  onLogout(): void {
    this.userService.logout()
    this.router.navigateByUrl('/userConnecting')
  }
}