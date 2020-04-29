import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SigninComponent } from './signin/signin.component';
import { UsersComponent } from './users/users.component';
import { SetupComponent } from './setup/setup.component';

const routes: Routes = [
  // default - dashboard
  {
    component: DashboardComponent,
    path: '',
  },
  {
    component: SetupComponent,
    path: 'setup'
  },
  {
    component: SigninComponent,
    path: 'signin',
  },
  {
    component: UsersComponent,
    path: 'users'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }