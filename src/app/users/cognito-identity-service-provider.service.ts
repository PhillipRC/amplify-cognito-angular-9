import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { from, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Amplify from 'aws-amplify';
import Auth from '@aws-amplify/auth';
import { AmplifyConfigurationService } from '../setup/amplify-configuration.service';

/**
 * Service to connect to AWS CognitoIdentityServiceProvider
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private amplifyConfiguration: AmplifyConfigurationService) {
    this.setCredentials();
  }

  /**
   * Set credentials
   */
  private setCredentials() {
    // set region
    AWS.config.region = this.amplifyConfiguration.configurationObj.region;
    return Auth.currentSession().then(currentSession => {
      // use the IdToken from the current session to get the credetials
      const loginValue = currentSession.getIdToken().getJwtToken();
      const loginKey = ('cognito-idp.' + this.amplifyConfiguration.configurationObj.region + '.amazonaws.com/' +
        this.amplifyConfiguration.configurationObj.userPoolId);
      // setup where to get the credentials from
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.amplifyConfiguration.configurationObj.identityPoolId,
        Logins: {
          [loginKey]: loginValue
        }
      });
      // refresh the credentials
      (AWS.config.credentials as AWS.CognitoIdentityCredentials).refresh((err) => { });
    });

  }

  /**
   * List the users
   */
  public listUsers(params: any = { Limit: 10 }) {

    // add required parameters
    const queryParams = { ...params };
    queryParams.UserPoolId = this.amplifyConfiguration.configurationObj.userPoolId;

    const provider = new AWS.CognitoIdentityServiceProvider();

    // convert promise to observable
    return from(provider.listUsers(queryParams).promise());
  }

}
