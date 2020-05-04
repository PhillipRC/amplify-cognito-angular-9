import { Component, ViewChild, Input, OnChanges, OnDestroy } from '@angular/core';
import { UserFormService, UserFormMode } from './user-form.service';
import { UsersService } from '../cognito-identity-service-provider.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
   * Id of user to edit - default to create a new user
   */
  @Input() userId = 0;

  // reference to set focus on this field
  @ViewChild('email', { static: true })
  email: any;

  /**
   * expose modes emun to template
   */
  public UserFormMode = UserFormMode;

  /**
   * Reference to later unsubscribe from the observer
   */
  private userSubscription?: Subscription;

  /**
   * Set focus to input
   */
  setFocus() {
    this.email.nativeElement.focus();
  }

  /**
   * Unsubscribe if subscribe
   */
  private unsubscribe() {
    // unsubscribe from listeners
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  /**
   * On construction injects the needed services
   */
  constructor(
    private router: Router,
    public userFormService: UserFormService,
    private userService: UsersService
  ) { }

  /**
   * Handle form submit
   */
  public submit() {
    const userData = this.userFormService.form.getRawValue();
    if (this.userFormService.mode === UserFormMode.create) {
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
              Name: 'email_verified',
              Value: 'True'
            }
          ]
        }
      ).subscribe(data => {
        // take user to the user list
        this.router.navigate(['users']);
      });
    }

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

    if (this.userId === 0) {
      // setup for for create
      this.userFormService.reset();
    }

  }

  /**
   * Handle when the component is destroyed
   */
  ngOnDestroy() {
    this.unsubscribe();
  }

}
