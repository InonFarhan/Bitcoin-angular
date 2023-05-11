import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    private userService: UserService,
    private location: Location,
    private router: Router,
  ) { }

  subscription!: Subscription
  user: any = { name: '', password: '' }
  users!: User[]

  ngOnInit() {
    this.userService.users$.subscribe(users => {
      this.users = users
    })
  }

  onLogin(ev: Event) {
    ev.preventDefault()
    try {
      if (!this.users.find(u => u.name === this.user.name)) {
        //need to use eventBus for message about the error...
        this.user.name = 'This user name is not exist'
        setTimeout(() => {
          this.user.name = ''
          this.router.navigateByUrl('/userConnecting')
        }, 1000)
      } else {
        this.userService.login(this.user)
        this.router.navigateByUrl('/')
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  onBack(): void {
    this.location.back();
  }
}