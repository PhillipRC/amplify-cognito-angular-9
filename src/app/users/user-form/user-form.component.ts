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
   * Handle form submit
   */
  public submit() {
    const userData = this.userFormService.form.getRawValue();
    if (this.userFormService.mode === UserFormMode.create) {
      // perform create
      this.userSubscription = this.userService.adminCreateUser(
        {
          Username: userData.username,
          DesiredDeliveryMediums: ['EMAIL'],
          UserAttributes: [
            {
              Name: 'email',
              Value: userData.email
            },
            {
              Name: 'name',
              Value: 'My Name'
            },
            {
              Name: 'email_verified',
              Value: 'True'
            }
          ]
        }
      ).subscribe(data => {
        // take user to the user list
        this.router.navigate(['users']);
      });
    } else {
      // perform update
      this.userSubscription = this.userService.adminUpdateUserAttributes(
        {
          Username: 'test',
          UserAttributes: [
            {
              Name: 'email',
              Value: userData.email
            }
          ]

        }
      ).subscribe();
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
    } else {
      // load user data
      this.userLoadSubscription = this.userService
        .adminGetUser({ Username: this.username })
        .subscribe(data => {
          // set edit mode
          this.userFormService.mode = UserFormMode.edit;
          // set the form data
          this.userFormService.set(data);
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
