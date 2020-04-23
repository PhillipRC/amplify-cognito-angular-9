import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import Amplify from 'aws-amplify';
import { AmplifyConfigurationService } from '../setup/amplify-configuration.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent {
  /**
   * expose environment to the template
   */
  public environment = environment;

  /**
   * expose configuration to the template
   */
  public configuration: any;

  constructor(public amplifyConfigService: AmplifyConfigurationService) {
    // load the configuration if it is set in local storage
    this.configuration = this.amplifyConfigService.getConfiguration();
  }

  public configure(
    event: Event,
    region: string,
    userPoolId: string,
    userPoolWebClientId: string,
    identityPoolId: string
  ) {
    event.preventDefault();
    const configurationObject = {
      region,
      userPoolId,
      userPoolWebClientId,
      identityPoolId
    };
    // set Amplify configuration
    Amplify.configure(configurationObject);

    // save the configuration to reload if the browser is refreshed
    this.amplifyConfigService.configured = true;
    this.amplifyConfigService.saveConfiguration(configurationObject);
  }

  public clear() {
    // clear the local storage
    this.amplifyConfigService.clearConfiguration();
    this.amplifyConfigService.configured = false;
    // reload the application
    location.reload();
  }
}

