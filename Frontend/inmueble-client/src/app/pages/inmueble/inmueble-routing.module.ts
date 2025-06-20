import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'nuevo',
    loadChildren: () => import('./pages/inmueble-nuevo/inmueble-nuevo.module').then(m =>m.InmuebleNuevoModule),
    canActivate: [AuthGuard] //you can access this route only if you are logged in
  },
  {
    path: 'list',
    loadChildren: () => import('./pages/inmueble-list/inmueble-list.module').then(m =>m.InmuebleListModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle/:id',
    loadChildren: () => import('./pages/inmueble-detalle/inmueble-detalle.module').then(m =>m.InmuebleDetalleModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InmuebleRoutingModule { }