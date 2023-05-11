import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Move } from 'src/app/models/move.model';

@Component({
  selector: 'app-move-list',
  templateUrl: './move-list.component.html',
  styleUrls: ['./move-list.component.scss']
})
export class MoveListComponent {
  @Input() moves!: Move[]
  @Input() contacts!: User[]
}