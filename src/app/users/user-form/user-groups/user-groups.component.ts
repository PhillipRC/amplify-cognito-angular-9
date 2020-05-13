import { Component, Input, OnDestroy, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../cognito-identity-service-provider.service';
import { Subscription, combineLatest, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Displays table of groups associated to a user
 */
@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Reference to group input element
   */
  @ViewChild('groupInput', { static: true })
  groupInput: any;

  /**
   * Username of user to edit
   */
  @Input() username = '';

  /**
   * User's assigned groups
   */
  public userGroups: any[] = [];

  /**
   * Groups the user is not assigned too
   */
  public availableGroups: any[] = [];

  /**
   * Reference to later unsubscribe from the observer
   */
  private userLoadGroupSubscription?: Subscription;

  /**
   * Controls displaying the loading indicator during asynchronous operations
   */
  public isLoading = true;

  /**
   * On construction injects the needed services
   */
  constructor(private userService: UsersService) { }

  /**
   * Unsubscribe if subscribed
   */
  private unsubscribe() {
    if (this.userLoadGroupSubscription) {
      this.userLoadGroupSubscription.unsubscribe();
    }
  }

  /**
   * Set group options based on userService.metaData minus the groups the user alread belongs too
   */
  public setGroupAutocompleteOptions(currentGroupOptions: any, adminListGroupsForUser: any) {
    if (currentGroupOptions) {
      const userGroupNames = adminListGroupsForUser.map((group: { GroupName: any; }) => group.GroupName);
      // create available group by filtering out groups in the userGroups
      this.availableGroups = currentGroupOptions.filter((group: { value: string; }) => {
        return userGroupNames.indexOf(group.value) === -1;
      });
    }
  }

  /**
   * Clear the group input
   */
  private clearGroupInput() {
    // delay to clash w/ mat-input initialization
    if (this.groupInput) {
      const groupInputElement = this.groupInput.nativeElement;
      setTimeout(() => {
        groupInputElement.value = '';
        groupInputElement.blur();
      }, 1);
    }

  }

  /**
   * Load the users group data
   */
  private load(): void {
    this.clearGroupInput();
    this.isLoading = true;
    this.unsubscribe();
    // load/refresh list of groups
    this.userService.updateGroups();
    // wait for both subscriptions to come back
    this.userLoadGroupSubscription = combineLatest(
      [
        this.userService.groupOptions,
        this.userService.adminListGroupsForUser({ Username: this.username })
      ]
    ).pipe(
      map(([groupOptionsReturn, adminListGroupsForUserReturn]) => {
        // save groups for template display
        this.userGroups = adminListGroupsForUserReturn.Groups;
        // set autocomplete options
        this.setGroupAutocompleteOptions(groupOptionsReturn, adminListGroupsForUserReturn.Groups);
        return;
      })
    ).subscribe(() => {
      // remove loading indicator
      this.isLoading = false;
    });
  }

  /**
   * Assigne a group to a user
   */
  public addGroup(group: any) {
    this.isLoading = true;
    this.unsubscribe();
    this.userLoadGroupSubscription = this.userService.adminAddUserToGroup(
      {
        Username: this.username,
        GroupName: group.value
      }
    ).subscribe(data => {
      this.load();
    });
  }

  /**
   * Handle when the user selects to add a group to a user
   */
  public autocompleteAddGroupSelected($event: any, option: any) {
    // only listen update the form if it was a user triggered event
    if ($event.isUserInput) {
      // add selected option
      this.addGroup(option);
    }
  }

  /**
   * Remove a group from the user
   */
  public removeGroup(group: any): void {
    this.isLoading = true;
    this.unsubscribe();
    this.userLoadGroupSubscription = this.userService.adminRemoveUserFromGroup(
      {
        Username: this.username,
        GroupName: group.GroupName
      }
    ).subscribe(data => {
      this.load();
    });
  }

  /**
   * Handle changes to the component input(s)
   */
  ngOnChanges() {
    // if there is a username load the data
    if (this.username !== '') {
      this.load();
    }
  }

  /**
   * Handles when the component is first created
   */
  ngOnInit() { }

  /**
   * Handle when the component is destroyed
   */
  ngOnDestroy() {
    this.unsubscribe();
  }

}
