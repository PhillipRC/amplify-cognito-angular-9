import { Component } from '@angular/core';
import Amplify from 'aws-amplify';
import { AmplifyConfigurationService } from './setup/amplify-configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private amplifyConfigService: AmplifyConfigurationService) {
    // a standard application would set the configuration on startup
    const configuration = amplifyConfigService.getConfiguration();
    if (amplifyConfigService.valid()) {
      Amplify.configure(configuration);
      amplifyConfigService.configured = true;
    }
  }
}
