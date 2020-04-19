import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// vendor components
import { AppVendorModule } from './app-vendor.module';

import {
  AmplifyAngularModule,
  AmplifyService,
  AmplifyModules,
} from 'aws-amplify-angular';
import Auth from '@aws-amplify/auth';
import { NavMainComponent } from './nav-main/nav-main.component';
import { CognitoAuthComponent } from './cognito-auth/cognito-auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AmplifyConfigComponent } from './amplify-config/amplify-config.component';

@NgModule({
  declarations: [
    AppComponent,
    CognitoAuthComponent,
    DashboardComponent,
    NavMainComponent,
    AmplifyConfigComponent,
  ],
  imports: [
    AmplifyAngularModule,
    AppRoutingModule,
    AppVendorModule,
    BrowserAnimationsModule,
    BrowserModule,
  ],
  providers: [
    {
      provide: AmplifyService,
      useFactory: () => {
        return AmplifyModules({
          Auth,
        });
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
