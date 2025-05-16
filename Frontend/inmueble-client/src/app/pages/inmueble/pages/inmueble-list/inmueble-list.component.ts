import { Component, OnInit } from '@angular/core';
import * as fromRoot from '@app/store';
import { select, Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import * as fromList from '../../store/save';
import { InmuebleResponse } from '../../store/save';
import { ConfirmationService } from '@app/services/confirmation/confirmation.service';

@Component({
  selector: 'app-inmueble-list',
  templateUrl: './inmueble-list.component.html',
  styleUrls: ['./inmueble-list.component.scss']
})
export class InmuebleListComponent implements OnInit {
  inmuebles$ ! : Observable<InmuebleResponse[] | null>
  loading$ ! : Observable<boolean | null>

  pictureDefault : string = "https://firebasestorage.googleapis.com/v0/b/edificacion-app.appspot.com/o/image%2F1637099019171_O5986058_0.jpg?alt=media&token=0a146233-d63b-4702-b28d-6eaddf5e207a"


 constructor(
    private store: Store<fromRoot.State>,
     private confirmation: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new fromList.Read());
    this.loading$ = this.store.pipe(select(fromList.getLoading));
    this.inmuebles$ = this.store.pipe(select(fromList.getInmuebles));
  }

  deleteInmueble(id: number): void {
   this.confirmation.confirm('¿Está seguro de que quiere eliminar este inmueble?')
   .pipe(take(1))
    .subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(new fromList.Delete(id));
      }
    });
}



}