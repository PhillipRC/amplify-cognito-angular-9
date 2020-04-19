import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import Amplify from 'aws-amplify';
import { AmplifyInitService } from './amplify-init.service';

@Component({
  selector: 'app-amplify-config',
  templateUrl: './amplify-config.component.html',
  styleUrls: ['./amplify-config.component.scss'],
})
export class AmplifyConfigComponent {
  /**
   * expose environment to the template
   */
  public environment = environment;

  /**
   * expose configuration to the template
   */
  public configuration: any;

  constructor(public amplifyInit: AmplifyInitService) {
    // load the configuration if it is set in local storage
    this.configuration = this.amplifyInit.getConfiguration();
  }

  public configure(
    event: Event,
    region: string,
    userPoolId: string,
    userPoolWebClientId: string
  ) {
    event.preventDefault();
    const configurationObject = {
      region,
      userPoolId,
      userPoolWebClientId,
    };
    // set Amplify configuration
    Amplify.configure(configurationObject);

    // save the configuration to reload if the browser is refreshed
    this.amplifyInit.configured = true;
    this.amplifyInit.saveConfiguration(configurationObject);
  }

  public clear() {
    // clear the local storage
    this.amplifyInit.clearConfiguration();
    this.amplifyInit.configured = false;
    // reload the application
    location.reload();
  }
}
