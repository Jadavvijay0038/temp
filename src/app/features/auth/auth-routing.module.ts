import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
    
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        // canActivate: [IsLoggedInGuard]
      },
      {
        path: 'forgotPassword',
        component: ForgotPasswordComponent
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
