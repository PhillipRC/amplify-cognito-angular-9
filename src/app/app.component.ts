import { Component } from '@angular/core';
import Amplify from 'aws-amplify';
import { AmplifyInitService } from './amplify-config/amplify-init.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private amplifyInit: AmplifyInitService) {
    // a standard application would set the configuration on startup
    const configuration = amplifyInit.getConfiguration();
    if (amplifyInit.valid()) {
      Amplify.configure(configuration);
      amplifyInit.configured = true;
    }
  }
}
