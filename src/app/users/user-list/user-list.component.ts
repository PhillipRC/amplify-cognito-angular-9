import { Component, OnInit } from '@angular/core';
import { UsersService } from '../cognito-identity-service-provider.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  /**
   * Expose users to the template
   */
  public users: any;

  /**
   * On construction injects the needed services
   */
  constructor(public usersService: UsersService) { }

  /**
   * Get a list of users
   */
  public listUsers() {
    this.usersService.listUsers().subscribe(data => {
      this.users = data.Users;
    });
  }

  /**
   * Handles when the component is first created
   */
  public ngOnInit() {
    this.listUsers();
  }

}
