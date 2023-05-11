import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-transfer-fund',
  templateUrl: './transfer-fund.component.html',
  styleUrls: ['./transfer-fund.component.scss']
})
export class TransferFundComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) { }

  amount!: string
  @Input() contact!: User
  @Input() coins!: string

  ngOnInit() {
    this.amount = ''
  }

  onTransfer(ev: Event) {
    ev.preventDefault()
    if (Number(this.coins) < Number(this.amount)) {
      //show some message
      return
    }
    if (Number(this.amount) > 0) this.userService.addMove(this.contact, this.amount)
    this.amount = ''
  }

  updateAmount(value: string) {
    this.amount = value
  }
}