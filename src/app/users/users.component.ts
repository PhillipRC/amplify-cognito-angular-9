import { Component, OnInit } from '@angular/core';
import { UsersService } from './cognito-identity-service-provider.service';

/**
 * Display a list of Users
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
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
