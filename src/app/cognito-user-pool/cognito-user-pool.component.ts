import { Component, } from '@angular/core';
import * as AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';
import { AmplifyInitService } from '../amplify-config/amplify-init.service';

@Component({
  selector: 'app-cognito-user-pool',
  templateUrl: './cognito-user-pool.component.html',
  styleUrls: ['./cognito-user-pool.component.scss']
})
export class CognitoUserPoolComponent {

  /**
   * expose the userList to the template
   */
  public userlistData: any;

  /**
   * expose configuration to the template
   */
  public configuration: any;

  constructor(public amplifyInit: AmplifyInitService) {
    // load the configuration if it is set in local storage
    this.configuration = this.amplifyInit.getConfiguration();
  }

  public setCognitoIdentityCredentials(event: Event, identityPoolId: string, userPoolId: string, region: string) {
    event.preventDefault();
    // set the region
    AWS.config.region = region;
    // get the current session information
    Auth.currentSession().then(currentSession => {

      // use the IdToken from the current session to get the credetials
      const loginValue = currentSession.getIdToken().getJwtToken();

      // setup where to get the credentials from
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: { ['cognito-idp.us-east-1.amazonaws.com/' + userPoolId]: loginValue }
      });

      // get the credentials
      AWS.config.getCredentials((err) => {
        if (err) {
          console.log(err);
        } else {
          alert('Success');
        }
      });
    });
  }

  public listUsers(event: Event, userPoolId: string, limit: number) {
    event.preventDefault();
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const params = {
      UserPoolId: userPoolId,
      Limit: limit
    };
    cognito.listUsers(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        alert('Success');
        console.log(data);
        this.userlistData = data;
      }
    });
  }
}
