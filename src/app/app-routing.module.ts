import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CognitoAuthComponent } from './cognito-auth/cognito-auth.component';
import { AmplifyConfigComponent } from './amplify-config/amplify-config.component';
import { CognitoUserPoolComponent } from './cognito-user-pool/cognito-user-pool.component';

const routes: Routes = [
  // default - dashboard
  {
    component: DashboardComponent,
    path: '',
  },
  {
    component: AmplifyConfigComponent,
    path: 'amplify-config',
  },
  {
    component: CognitoAuthComponent,
    path: 'cognito-auth',
  },
  {
    component: CognitoUserPoolComponent,
    path: 'cognito-user-pool'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
