import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    private userService: UserService
  ) { }

  subscription!: Subscription
  user!: User

  ngOnInit() {
    this.subscription = this.userService.user$.subscribe(
      (user) => {
        if (user) {
          this.user = user
        }
      }
    )
  }
}