import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { defer } from 'rxjs';

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

  /**
   * On construction injects the needed services
   */
  constructor(private amplifyConfiguration: AmplifyConfigurationService) { }

  /**
   * Set credentials
   */
  private async setCredentials() {
    // set region based on saved configuration
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
   * List of Users as a Promise
   */
  public async listUsersAsync(params: any = { Limit: 10 }) {
    // hit the set credentials for the user
    await this.setCredentials();
    // add required parameters from the saved configuration
    const queryParams = { ...params };
    queryParams.UserPoolId = this.amplifyConfiguration.configurationObj.userPoolId;
    // query for list of users
    const provider = new AWS.CognitoIdentityServiceProvider();
    return provider.listUsers(queryParams).promise();
  }

  /**
   * List of Users as an Observable
   */
  public listUsers(params?: any) {
    // using defer to wrap the promse and wait for it to finish
    return defer(() => {
      return this.listUsersAsync(params);
    });
  }

}
