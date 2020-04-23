import { Component, } from '@angular/core';
import * as AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';
import { AmplifyConfigurationService } from '../setup/amplify-configuration.service';

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

  constructor(public amplifyConfigService: AmplifyConfigurationService) {
    // load the configuration if it is set in local storage
    this.configuration = this.amplifyConfigService.getConfiguration();
  }

  public setCognitoIdentityCredentials(event: Event, identityPoolId: string) {
    event.preventDefault();

    // update with identityPoolId
    const config = { ...this.amplifyConfigService.getConfiguration() };
    config.identityPoolId = identityPoolId;
    this.amplifyConfigService.saveConfiguration(config);

    // set the region
    AWS.config.region = config.region;
    // get the current session information
    Auth.currentSession().then(currentSession => {

      // use the IdToken from the current session to get the credetials
      const loginValue = currentSession.getIdToken().getJwtToken();

      // setup where to get the credentials from
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: { ['cognito-idp.us-east-1.amazonaws.com/' + config.userPoolId]: loginValue }
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
