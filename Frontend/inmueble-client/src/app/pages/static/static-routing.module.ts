import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m=> m.WelcomeModule),
    // you wont be able to access this route if you are not logged in
    canActivate: [AuthGuard]
  },
  {
    path: '404',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m=> m.NotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule { }