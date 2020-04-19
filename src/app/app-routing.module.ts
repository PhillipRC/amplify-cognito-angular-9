import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CognitoAuthComponent } from './cognito-auth/cognito-auth.component';
import { AmplifyConfigComponent } from './amplify-config/amplify-config.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
