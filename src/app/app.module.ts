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
import { SigninComponent } from './signin/signin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { SetupComponent } from './setup/setup.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { LoaderComponentComponent } from './shared/components/loader-component/loader-component.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    DashboardComponent,
    NavMainComponent,
    UsersComponent,
    SetupComponent,
    UserCreateComponent,
    UserListComponent,
    UserFormComponent,
    UserEditComponent,
    LoaderComponentComponent
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
export class AppModule { }
