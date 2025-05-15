import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as fromActions from './save.actions';
import { InmuebleCreateRequest, InmuebleResponse, InmuebleUpdateRequest } from './save.models';
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

  read: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.READ),
      switchMap(() =>
        this.httpClient.get<InmuebleResponse[]>(`${environment.url}api/inmueble`)
          .pipe(
            delay(500),
            //map is used for transforming the data|
            map((inmuebles: InmuebleResponse[]) => new fromActions.ReadSuccess(inmuebles)),
            catchError(err => of(new fromActions.ReadError(err.message)))
          )
      )
    )
  );

  read_one: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.READ_ONE),
      switchMap((action: fromActions.ReadOne) =>
        this.httpClient.get<InmuebleResponse>(`${environment.url}api/inmueble/${action.id}`)
          .pipe(
            delay(500),
            //map is used for transforming the data|
            map((inmueble: InmuebleResponse) => new fromActions.ReadOneSuccess(inmueble)),
            catchError(err => of(new fromActions.ReadOneError(err.message)))
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

  update: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.UPDATE),
      switchMap((action: fromActions.Update) =>
        this.httpClient.put<InmuebleResponse>(
          `${environment.url}api/inmueble/${action.id}`,
          action.inmueble
        ).pipe(
          delay(500),
          tap(() => {
            this.notification.success('Inmueble actualizado correctamente');
            this.router.navigate(['inmueble/list']);
          }),
          map((inmueble: InmuebleResponse) => new fromActions.UpdateSuccess(inmueble)),
          catchError(err => {
            this.notification.error(`Errores guardando el inmueble: ${err.message}`);
            return of(new fromActions.UpdateError(err.message));
          })
        )
      )
    )
  );




}