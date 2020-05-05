import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SigninComponent } from './signin/signin.component';
import { UsersComponent } from './users/users.component';
import { SetupComponent } from './setup/setup.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';

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
    path: 'users',
    children: [
      {
        component: UserListComponent,
        path: ''
      },
      {
        component: UserCreateComponent,
        path: 'add'
      },
      {
        component: UserEditComponent,
        path: ':id'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
