import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';
import { from, Subscription, Observer } from 'rxjs';
import { resolve } from 'dns';

/**
 * Service to track the Amplify configuration
 */
@Injectable({
  providedIn: 'root',
})
export class AmplifyConfigurationService {

  /**
   * Flag to indicate if Amplify has been configured
   */
  public configured = false;

  /**
   * interneral storage for the configuration
   */
  public configurationObj: any;

  /**
   * Save the configuration to localStorage
   */
  public saveConfiguration(obj: any) {
    this.configurationObj = obj;
    localStorage.setItem('configuration', JSON.stringify(obj));
  }

  /**
   * Get the configuration from localStorage
   */
  public getConfiguration() {
    const config = localStorage.getItem('configuration');
    if (config === null) {
      this.configurationObj = JSON.parse('{}');
    } else {
      this.configurationObj = JSON.parse(config);
    }
    return this.configurationObj;
  }

  /**
   * Remove the configuration from localStorage
   */
  public clearConfiguration() {
    localStorage.removeItem('configuration');
  }

  /**
   * Return true if the config looks to be valid - has region set
   */
  public valid() {
    return this.configurationObj.region;
  }

}
