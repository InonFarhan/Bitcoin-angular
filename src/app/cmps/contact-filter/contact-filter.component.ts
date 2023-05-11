import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserFilter } from 'src/app/models/user.model';

@Component({
  selector: 'app-contact-filter',
  templateUrl: './contact-filter.component.html',
  styleUrls: ['./contact-filter.component.scss']
})
export class ContactFilterComponent implements OnInit {
  constructor(private userService: UserService) { }
  filterBy = {} as UserFilter

  ngOnInit() {
    this.userService.userFilter$.subscribe(userFilter => this.filterBy = userFilter)
  }

  onSetFilter() {
    this.userService.setFilter(this.filterBy)
  }

}
