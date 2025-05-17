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


  create: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.CREATE),
      map((action: fromActions.Create) => action.inmueble),
      switchMap((request: InmuebleCreateRequest) =>
        this.httpClient.post<InmuebleResponse>(`${environment.url}api/inmueble`, request).pipe(
          delay(1000),
          map((inmueble: InmuebleResponse) => new fromActions.CreateSuccess(inmueble)),
          catchError(err => of(new fromActions.CreateError(err.message)))
        )
      )
    )
  );

  createSuccessEffects: Observable<void> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.CREATE_SUCCESS),
      tap(() => {
        this.notification.success('Inmueble guardado correctamente');
        this.router.navigate(['inmueble/list']);
      })
    ),
    { dispatch: false }
  );


  createErrorNotify = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.CREATE_ERROR),
      tap((action: fromActions.CreateError) => {
        this.notification.error(`Errores guardando el inmueble: ${action.error}`);
      })
    ),
    { dispatch: false }  // <== THIS IS REQUIRED
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
          map((inmueble: InmuebleResponse) => new fromActions.UpdateSuccess(inmueble)),
          catchError(err => of(new fromActions.UpdateError(err.message)))
        )
      )
    )
  );
  updateSuccessNotify: Observable<void> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.UPDATE_SUCCESS),
      tap(() => {
        this.notification.success('Inmueble actualizado correctamente');
        this.router.navigate(['inmueble/list']);
      })
    ),
    { dispatch: false }
  );

  updateErrorNotify = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.UPDATE_ERROR),
      tap((action: fromActions.UpdateError) => {
        this.notification.error(`Errores guardando el inmueble: ${action.error}`);
      })
    ),
    { dispatch: false }  // <== THIS IS REQUIRED
  );




  delete = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.DELETE),
      switchMap((action: fromActions.Delete) =>
        this.httpClient.delete(`${environment.url}api/inmueble/${action.id}`).pipe(
          delay(500),
          map(() => new fromActions.DeleteSuccess(action.id)),
          catchError(err =>
            of(new fromActions.DeleteError(err.message))
          )
        )
      )
    )
  );


  deleteSuccessNotify = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.DELETE_SUCCESS),
      tap(() => {
        this.notification.success('Inmueble eliminado correctamente');
      })
    ),
    { dispatch: false }
  );

  deleteErrorNotify = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.DELETE_ERROR),
      tap((action: fromActions.DeleteError) => {
        this.notification.error(`Errores eliminando el inmueble: ${action.error}`);
      })
    ),
    { dispatch: false }
  );



}