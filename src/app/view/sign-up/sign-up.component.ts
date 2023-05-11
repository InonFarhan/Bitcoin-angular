import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  constructor(
    private userService: UserService,
    private location: Location,
    private router: Router,
  ) { }

  subscription!: Subscription
  user!: User
  users!: User[]

  ngOnInit() {
    this.loadUser()
    this.loadUsers()
  }

  loadUser() {
    this.user = this.userService.getEmptyUser()
  }

  loadUsers() {
    this.userService.users$.subscribe(users => {
      this.users = users
    })
  }

  onSignUp(ev: Event) {
    ev.preventDefault()
    try {
      if (this.users.find(u => u.name === this.user.name)) {
        //need to use eventBus for show message about the error...
        this.user.name = 'This user name is already exist'
        setTimeout(() => {
          this.user.name = ''
          this.router.navigateByUrl('/userConnecting')
        }, 1000)
      } else if (this.users.find(u => u.email === this.user.email)) {
        //need to use eventBus for show message about the error...
        this.user.email = 'This email is already exist'
        setTimeout(() => {
          this.user.email = ''
          this.router.navigateByUrl('/userConnecting')
        }, 1000)
      } else {
        this.userService.signUp(this.user)
        this.router.navigateByUrl('/')
      }
    }
    catch (error) {
      console.log('error:', error)
    }
  }

  onBack(): void {
    this.location.back();
  }

}