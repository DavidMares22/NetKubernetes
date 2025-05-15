import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InmuebleDetalleComponent } from './inmueble-detalle.component';

const routes: Routes = [
  {
    path: '',
    component: InmuebleDetalleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InmuebleDetalleRoutingModule { }