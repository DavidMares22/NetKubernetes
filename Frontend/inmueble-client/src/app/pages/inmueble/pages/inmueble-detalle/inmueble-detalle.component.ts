import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import * as fromRoot from '@app/store';
import * as fromList from '../../store/save';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { InmuebleResponse } from '../../store/save';

@Component({
  selector: 'app-inmueble-detalle',
  templateUrl: './inmueble-detalle.component.html',
  styleUrls: ['./inmueble-detalle.component.scss']
})
export class InmuebleDetalleComponent implements OnInit {
  loading$ !: Observable<boolean | null>;
  inmueble !: InmuebleResponse;
  photoLoaded!: string;

  constructor(
    private store: Store<fromRoot.State>,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loading$ = this.store.pipe(select(fromList.getLoading));
    
    if(!isNaN(id)){
    this.store.dispatch(new fromList.ReadOne(id));

      this.store.pipe(select(fromList.getSelectedInmueble)).subscribe(inmueble => {
        if (inmueble) {
          // this.inmueble = inmueble;
          this.inmueble = { ...inmueble }; 
          // this.photoLoaded = inmueble.picture; // preload image if needed
        }
      });
    }
  }

 actualizarInmueble(form: NgForm): void {
  if (form.valid && this.inmueble) {
    const updatedInmueble: fromList.InmuebleUpdateRequest = {
      nombre: form.value.nombre,
      direccion: form.value.direccion,
      precio: Number(form.value.precio),
      picture: null,
    };

    this.store.dispatch(new fromList.Update(this.inmueble.id, updatedInmueble));
  }
}


  // onFilesChanged(url: any): void {
  //   if(url){
  //     this.photoLoaded = url;
  //   }

  // }

  ngOnDestroy(): void {
  this.store.dispatch(new fromList.ClearInmueble());
}

}