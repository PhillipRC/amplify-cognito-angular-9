import { Injectable } from '@angular/core';
import { defer } from 'rxjs';
import Auth from '@aws-amplify/auth';
import { AmplifyConfigurationService } from '../setup/amplify-configuration.service';
// AWS global namespace
const AWS = require('aws-sdk/global');
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
const CognitoIdentityServiceProvider = require('aws-sdk/clients/cognitoidentityserviceprovider');

/**
 * Service to connect to AWS CognitoIdentityServiceProvider
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  /**
   * On construction injects the needed services
   */
  constructor(private amplifyConfiguration: AmplifyConfigurationService) {

  }

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
      AWS.config.credentials.refresh(() => { });
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
    const provider = new CognitoIdentityServiceProvider();
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

  /**
   * AdminCreateUser
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminCreateUser-property
   * https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminCreateUser.html
   */
  public async adminCreateUserAsync(params: any) {
    // hit the set credentials for the user
    await this.setCredentials();
    // add required parameters from the saved configuration
    const queryParams = { ...params };
    queryParams.UserPoolId = this.amplifyConfiguration.configurationObj.userPoolId;
    // query for list of users
    const provider = new CognitoIdentityServiceProvider();
    return provider.adminCreateUser(queryParams).promise();
  }

  /**
   * AdminCreateUser as an Observable
   */
  public adminCreateUser(params?: any) {
    // using defer to wrap the promse and wait for it to finish
    return defer(() => {
      return this.adminCreateUserAsync(params);
    });
  }

}
