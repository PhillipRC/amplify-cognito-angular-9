import { Component } from '@angular/core';
import { UsersService } from './cognito-identity-service-provider.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  /**
   * Expose users to the template
   */
  public users: any;

  constructor(public usersService: UsersService) { }

  /**
   * Get a list of users
   */
  public listUsers() {
    this.usersService.listUsers().subscribe(data => {
      this.users = (data as any).Users;
    });
  }

}
