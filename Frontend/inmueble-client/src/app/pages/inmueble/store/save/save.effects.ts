import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as fromActions from './save.actions';
import { InmuebleCreateRequest, InmuebleResponse } from './save.models';
import { environment } from 'environments/environment';

type Action = fromActions.All;

@Injectable()
export class SaveEffects {

  constructor(
    private actions: Actions,
    private httpClient: HttpClient,
    private router: Router,
    private notification: NotificationService
  ) { }

  read: Observable<Action> = createEffect( () =>
      this.actions.pipe(
        ofType(fromActions.Types.READ),
        switchMap( () =>
          this.httpClient.get<InmuebleResponse[]>(`${environment.url}api/inmueble`)
          .pipe(
            delay(1000),
            //map is used for transforming the data|
            map((inmuebles: InmuebleResponse[]) => new fromActions.ReadSuccess(inmuebles) ),
            catchError(err => of(new fromActions.ReadError(err.message)))
          )
        )
      )
  );

  //this effect is called after the action is dispatched, 
  // then it will call the httpClient to make a post request to the api
  // after the post request is done, it will navigate to the list page
  // if the post request is successful, it will dispatch the CreateSuccess action
  // if the post request fails, it will dispatch the CreateError action
  // the CreateSuccess action will be handled by the reducer
  // the reducer will update the state with the new inmueble

  create: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.CREATE),
      map((action: fromActions.Create) => action.inmueble),
      switchMap((request: InmuebleCreateRequest) =>
        this.httpClient.post<InmuebleResponse>(`${environment.url}api/inmueble`, request)
          .pipe(
            delay(1000),
            tap((response: InmuebleResponse) => {
              this.router.navigate(['inmueble/list']);
            }),
            map((inmueble: InmuebleResponse) => new fromActions.CreateSuccess(inmueble)),
            catchError(err => {
              this.notification.error(`Errores guardando el inmueble: ${err.message}`);
              return of(new fromActions.CreateError(err.message));
            })
          )
      )
    )
  );



}