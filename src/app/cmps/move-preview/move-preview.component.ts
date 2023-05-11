import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Move } from 'src/app/models/move.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-move-preview',
  templateUrl: './move-preview.component.html',
  styleUrls: ['./move-preview.component.scss']
})
export class MovePreviewComponent implements OnInit {
  constructor(private userService: UserService) { }
  subscription!: Subscription
  contact: User | null = null

  @Input() move!: Move
  @Input() contacts: User[] | null = null

  ngOnInit() {
    if (this.contacts) this.userService.getById(this.move.toId).subscribe(user => this.contact = user)
  }
}
