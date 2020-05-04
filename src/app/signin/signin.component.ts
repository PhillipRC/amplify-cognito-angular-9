import { Component, OnDestroy, OnInit } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { AmplifyConfigurationService } from '../setup/amplify-configuration.service';
import { from, Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit, OnDestroy {
  /**
   * expose the state to the template
   */
  public state: any = null;

  /**
   * expose the user data to the template
   */
  public currentUserInfoData: any | null = null;
  public currentAuthenticatedUserData: any | null = null;
  public currentCredentialsData: any | null = null;
  public currentSessionData: any | null = null;
  public currentUserCredentialsData: any | null = null;
  public currentUserPoolUserData: any | null = null;
  public cognitoUser: CognitoUser | null = null;

  /**
   * expose the entire authState to the template
   */
  public authState: any;

  /**
   * reference to later unsubscribe
   */
  private amplifyServiceSubscription: Subscription | null = null;

  /**
   * reference to later unsubscribe
   */
  private currentUserInfoSubscription: Subscription | null = null;
  private currentAuthenticatedUserSubscription: Subscription | null = null;
  private currentCredentialsSubscription: Subscription | null = null;
  private currentSessionSubscription: Subscription | null = null;
  private currentUserCredentialsSubscription: Subscription | null = null;
  private currentUserPoolUserSubscription: Subscription | null = null;

  /**
   * Injected the needed services
   */
  constructor(
    private amplifyService: AmplifyService,
    public amplifyConfigService: AmplifyConfigurationService
  ) { }

  /**
   * Success handler
   */
  private success(data: any) {
    console.log(data);
    alert('Success');
  }

  /**
   * Error handler
   */
  private failure(data: any) {
    console.log(data);
    alert(
      'Failure\ncode: ' +
      data.code +
      '\nname: ' +
      data.name +
      '\nmessage: ' +
      data.message
    );
  }

  /**
   * Perform sign up
   */
  public signUp(
    event: Event,
    username: string,
    password: string,
    email: string
  ) {
    event.preventDefault();
    this.amplifyService.auth().signUp({
      username,
      password,
      attributes: {
        email,
      },
    })
      .then((data: any) => {
        this.success(data);
      })
      .catch((error: any) => {
        this.failure(error);
      });
  }

  /**
   * Perform confirm sign up
   */
  public confirmSignUp(event: Event, username: string, code: string) {
    event.preventDefault();
    this.amplifyService.auth().confirmSignUp(username, code)
      .then((data: any) => {
        this.success(data);
      })
      .catch((error: any) => {
        this.failure(error);
      });
  }

  /**
   * Perform sign in
   */
  public signIn(event: Event, user: string, password: string) {
    event.preventDefault();
    // Auth.signIn
    this.amplifyService.auth().signIn(user, password)
      .then((cognitoUser: CognitoUser | any) => {
        this.success(cognitoUser);
      })
      .catch((error: any) => {
        this.failure(error);
      });
  }

  /**
   * Perform sign out
   */
  public signOut() {
    this.amplifyService.auth().signOut();
  }

  /**
   * Change Password
   */
  public changePassword(event: Event, oldPassword: string, newPassword: string) {
    event.preventDefault();
    this.amplifyService.auth().changePassword(this.currentAuthenticatedUserData, oldPassword, newPassword)
      .then((data: any) => {
        this.success(data);
      })
      .catch((error: any) => {
        this.failure(error);
      });
  }

  /**
   * Get the various forms of user data available from the Amplify library
   */
  public getUserData(): void {

    // currentAuthenticatedUser()
    this.currentAuthenticatedUserSubscription = from(this.amplifyService.auth().currentAuthenticatedUser()).subscribe(
      data => {
        this.currentAuthenticatedUserData = data;
        this.currentAuthenticatedUserSubscription?.unsubscribe();
      }
    );

    // currentCredentials()
    this.currentAuthenticatedUserSubscription = from(this.amplifyService.auth().currentCredentials()).subscribe(
      data => {
        this.currentCredentialsData = data;
        this.currentCredentialsSubscription?.unsubscribe();
      }
    );

    // currentCredentials()
    this.currentSessionSubscription = from(this.amplifyService.auth().currentSession()).subscribe(
      data => {
        this.currentSessionData = data;
        this.currentSessionSubscription?.unsubscribe();
      }
    );

    // currentUserCredentials()
    this.currentSessionSubscription = from(this.amplifyService.auth().currentUserCredentials()).subscribe(
      data => {
        this.currentUserCredentialsData = data;
        this.currentUserCredentialsSubscription?.unsubscribe();
      }
    );

    // currentUserInfo()
    this.currentUserInfoSubscription = from(this.amplifyService.auth().currentUserInfo()).subscribe(
      data => {
        this.currentUserInfoData = data;
        this.currentUserInfoSubscription?.unsubscribe();
      }
    );

    // currentUserPoolUser()
    this.currentUserInfoSubscription = from(this.amplifyService.auth().currentUserPoolUser()).subscribe(
      data => {
        this.currentUserPoolUserData = data;
        this.currentUserPoolUserSubscription?.unsubscribe();
      }
    );

  }

  /**
   * Handles when the component is first created
   */
  ngOnInit() {
    // setup listener for auth state change
    this.amplifyServiceSubscription = this.amplifyService.authStateChange$.subscribe((authState) => {
      // save the returned state
      this.state = authState.state;
    });

    this.getUserData();
  }

  /**
   * Handle when the component is destroyed
   */
  public ngOnDestroy(): void {
    if (this.amplifyServiceSubscription) {
      this.amplifyServiceSubscription.unsubscribe();
    }
  }
}
