import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthGuard } from '@app/guards/unauth/unauth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m=>m.LoginModule),
    // you wont be able to access this route if you are already logged in
    canActivate: [UnauthGuard]

  },
  {
    path: 'registration',
    loadChildren: () => import('./pages/registration/registration.module').then(m=>m.RegistrationModule),
    // you wont be able to access this route if you are already logged in
    canActivate: [UnauthGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m=>m.ForgotPasswordModule),
    canActivate: [UnauthGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }