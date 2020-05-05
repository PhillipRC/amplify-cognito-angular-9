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

  private userPoolId: string;

  /**
   * On construction injects the needed services
   */
  constructor(private amplifyConfiguration: AmplifyConfigurationService) {
    this.userPoolId = this.amplifyConfiguration.configurationObj.userPoolId;
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
   * Provide a common async call to wrap credetials and API call
   */
  private async providerAsync(name: string, params: any) {
    // hit the set credentials for the user
    await this.setCredentials();
    // add required parameters from the saved configuration
    const queryParams = { ...params };
    queryParams.UserPoolId = this.userPoolId;
    const provider = new CognitoIdentityServiceProvider();
    return provider[name](queryParams).promise();
  }

  /**
   * Provides a common call to wrap the API Promise in an Observable
   * @param name Name of the API method to call
   * @param params Params to pass to the method
   */
  public providerObservable(name: string, params: any) {
    // using defer to wrap the promse and wait for it to finish
    return defer(() => {
      return this.providerAsync(name, params);
    });
  }

  /**
   * List of Users as an Observable
   */
  public listUsers(params?: any) {
    return this.providerObservable('listUsers', params);
  }

  /**
   * AdminCreateUser as an Observable
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminCreateUser-property
   * https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminCreateUser.html
   */
  public adminCreateUser(params?: any) {
    return this.providerObservable('adminCreateUser', params);
  }

  /**
   * AdminGetUser as an Observable
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminGetUser-property
   */
  public adminGetUser(params?: any) {
    return this.providerObservable('adminGetUser', params);
  }

  /**
   * AdminUpdateUserAttributes as an Observable
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminUpdateUserAttributes-property
   */
  public adminUpdateUserAttributes(params?: any) {
    return this.providerObservable('adminUpdateUserAttributes', params);
  }

  /**
   * AdminEnableUser as an Observable
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminEnableUser-property
   */
  public adminEnableUser(params?: any) {
    return this.providerObservable('adminEnableUser', params);
  }

  /**
   * AdminEnableUser as an Observable
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminDisableUser-property
   */
  public adminDisableUser(params?: any) {
    return this.providerObservable('adminDisableUser', params);
  }

  /**
   * AdminDeleteUser
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminDeleteUser-property
   */
  public adminDeleteUser(params?: any) {
    return this.providerObservable('adminDeleteUser', params);
  }

}
