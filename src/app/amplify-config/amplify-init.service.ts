import { Injectable } from '@angular/core';

/**
 * Service to track if the Amplify has been configured
 */
@Injectable({
  providedIn: 'root',
})
export class AmplifyInitService {
  public configured = false;
  public configurationObj: any;
  /**
   * Save the configuration to local storage
   */
  public saveConfiguration(obj: any) {
    this.configurationObj = obj;
    localStorage.setItem('configuration', JSON.stringify(obj));
  }
  /**
   * Get the configuration from local storage
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
   * Remove the configuration
   */
  public clearConfiguration() {
    localStorage.removeItem('configuration');
  }

  /**
   * If the config looks to be valid
   */
  public valid() {
    if (this.configurationObj.region) {
      console.log('valid');
    } else {
      console.log('not valid');
    }

    return this.configurationObj.region;
  }
}
