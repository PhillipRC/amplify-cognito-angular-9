import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../cognito-identity-service-provider.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

  /**
   * Expose users to the template
   */
  public users: any;

  /**
   * Reference to later unsubscribe
   */
  private usersServiceSubscription?: Subscription;

  /**
   * Controls displaying the loading indicator during asynchronous operations
   */
  public isLoading = true;

  /**
   * On construction injects the needed services
   */
  constructor(public usersService: UsersService) { }

  /**
   * Get a list of users
   */
  public listUsers() {
    this.usersServiceSubscription = this.usersService.listUsers().subscribe(data => {
      // save data for template
      this.users = data.Users;
      // remove loader
      this.isLoading = false;
    });
  }

  /**
   * Handles when the component is first created
   */
  public ngOnInit() {
    this.listUsers();
  }

  /**
   * Handles when the component is destroyed.
   * Removes any observer subscriptions that were created
   */
  public ngOnDestroy() {
    if (this.usersServiceSubscription) {
      this.usersServiceSubscription.unsubscribe();
    }
  }

}
