import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InmuebleRoutingModule } from './inmueble-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InmuebleRoutingModule,
    StoreModule.forFeature('inmueble', reducers), // Registering the reducers for the 'inmueble' feature
    // This is where you register the effects for the 'inmueble' feature
    EffectsModule.forFeature(effects)
  ]
})
export class InmuebleModule { }