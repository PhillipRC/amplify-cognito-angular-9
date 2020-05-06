import { Component, OnDestroy, Input, OnChanges } from '@angular/core';
import { UsersService } from '../cognito-identity-service-provider.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnDestroy, OnChanges {

  /**
   * params to search with
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listUsers-property
   */
  @Input() params: any | null = null;

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
  constructor(public usersService: UsersService, private router: Router) { }

  /**
   * Open an item
   */
  public openItem(item: any) {
    this.router.navigate(['users/' + item.Username]);
  }

  /**
   * Get a list of users
   */
  public listUsers() {
    if (this.params !== null) {
      this.usersServiceSubscription = this.usersService.listUsers(this.params).subscribe(data => {
        // save data for template
        this.users = data.Users;
        // remove loader
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
    }
  }

  /**
   * Handle changes from component inputs
   */
  public ngOnChanges() {
    this.isLoading = true;
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
