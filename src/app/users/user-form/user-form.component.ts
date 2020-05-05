import { Component, ViewChild, Input, OnChanges, OnDestroy } from '@angular/core';
import { UserFormService, UserFormMode } from './user-form.service';
import { UsersService } from '../cognito-identity-service-provider.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnChanges, OnDestroy {
  /**
   * Set the focus to the first input
   */
  @Input() focus = false;

  /**
   * username of user to edit
   */
  @Input() username = '';

  // reference to set focus on this field
  @ViewChild('usernameinput', { static: true })
  usernameinput: any;

  /**
   * expose modes emun to template
   */
  public UserFormMode = UserFormMode;

  /**
   * Reference to later unsubscribe from the observer
   */
  private userSubscription?: Subscription;

  /**
   * Reference to later unsubscribe from the observer
   */
  private userLoadSubscription?: Subscription;

  /**
   * Controls displaying the loading indicator during asynchronous operations
   */
  public isLoading = true;

  /**
   * Set focus to input
   */
  setFocus() {
    this.usernameinput.nativeElement.focus();
  }

  /**
   * Unsubscribe if subscribe
   */
  private unsubscribe() {
    // unsubscribe from listeners
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.userLoadSubscription) {
      this.userLoadSubscription.unsubscribe();
    }
  }

  /**
   * On construction injects the needed services
   */
  constructor(
    private router: Router,
    public userFormService: UserFormService,
    private userService: UsersService,
    private location: Location
  ) { }

  /**
   * Toggle Enabled status of user based on current status
   */
  public enableToggle() {
    // display loading indicator
    this.isLoading = true;
    // unsubscribe form anything before
    this.unsubscribe();
    const userData = this.userFormService.form.getRawValue();
    const params = {
      Username: userData.Username
    };
    let method = 'adminEnableUser';
    if (userData.Enabled) {
      method = 'adminDisableUser';
    }
    this.userSubscription = this.userService.providerObservable(method, params).subscribe(
      data => {
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  /**
   * Delete a user
   */
  public deleteUser() {
    // display loading indicator
    this.isLoading = true;

    // confirmation
    const confirmRemove = confirm(
      'Are you sure you want to proceed with removing the User?'
    );
    if (confirmRemove === false) {
      // display loader
      this.isLoading = false;
      return;
    }

    // unsubscribe form anything before
    this.unsubscribe();
    const userData = this.userFormService.form.getRawValue();
    const params = {
      Username: userData.Username
    };
    this.userSubscription = this.userService.adminDeleteUser(params).subscribe(
      data => {
        this.isLoading = false;
        this.router.navigate(['users']);
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  /**
   * Handle form submit
   */
  public submit() {
    // display loading indicator
    this.isLoading = true;
    // unsubscribe form anything before
    this.unsubscribe();
    const userData = this.userFormService.form.getRawValue();
    // create object with common paramaters to submit to API
    const params: any = {
      Username: userData.Username,
      UserAttributes: [
        {
          Name: 'email',
          Value: userData.Email
        },
        {
          Name: 'name',
          Value: (userData.Name ? userData.Name : '')
        }
      ]
    };
    if (this.userFormService.mode === UserFormMode.create) {
      // add verification
      params.DesiredDeliveryMediums = ['EMAIL'];
      params.UserAttributes.push(
        {
          Name: 'email_verified',
          Value: 'True'
        }
      );
      // perform create
      this.userSubscription = this.userService.adminCreateUser(params).subscribe(data => {
        // take user to the user list
        this.router.navigate(['users']);
      });
    } else {
      // perform update
      this.userSubscription = this.userService.adminUpdateUserAttributes(params).subscribe(
        data => {
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
        }
      );
    }

  }

  /**
   * Perform browser back operation
   */
  public back() {
    this.location.back();
  }

  /**
   * Handle changes from component inputs
   */
  ngOnChanges() {
    // focus on the input when set
    if (this.focus === true) {
      this.setFocus();
    }

    // set back to pristine
    this.userFormService.form.markAsPristine();

    if (this.username === '') {
      this.userFormService.mode = UserFormMode.create;
      // setup for for create
      this.userFormService.reset();
      // remove loader
      this.isLoading = false;
    } else {
      // load user data
      this.userLoadSubscription = this.userService
        .adminGetUser({ Username: this.username })
        .subscribe(data => {
          // set edit mode
          this.userFormService.mode = UserFormMode.edit;
          // set the form data
          this.userFormService.set(data);
          // remove loader
          this.isLoading = false;
        });
    }

  }

  /**
   * Handle when the component is destroyed
   */
  ngOnDestroy() {
    this.unsubscribe();
  }

}
