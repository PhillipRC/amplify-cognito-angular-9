import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import Auth from '@aws-amplify/auth';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { AmplifyInitService } from '../amplify-config/amplify-init.service';

@Component({
  selector: 'app-cognito-auth',
  templateUrl: './cognito-auth.component.html',
  styleUrls: ['./cognito-auth.component.scss'],
})
export class CognitoAuthComponent {
  /**
   * expose the state to the template
   */
  public state: any;

  /**
   * expose the entire authState to the template
   */
  public authState: any;

  /**
   * Injected the needed services
   */
  constructor(
    private amplifyService: AmplifyService,
    public amplifyInit: AmplifyInitService
  ) {
    // setup listener for auth state change
    this.amplifyService.authStateChange$.subscribe((authState) => {
      this.state = authState.state;
      this.authState = authState;
    });
  }

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
    Auth.signUp({
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
    Auth.confirmSignUp(username, code)
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
    Auth.signIn(user, password)
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
    Auth.signOut();
  }
}
