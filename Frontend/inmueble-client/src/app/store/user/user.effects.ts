import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "@app/services";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { environment } from "@src/environments/environment";
import { Observable, of } from "rxjs";
import { catchError, switchMap, tap, map } from "rxjs/operators";
import * as fromActions from './user.actions';
import { UserResponse } from "./user.models";



type Action = fromActions.All;

@Injectable()
export class UserEffects {

  constructor(
    private actions: Actions,
    private router: Router,
    private httpClient: HttpClient,
    private notification: NotificationService
  ) { }

  signUpEmail: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.SIGN_UP_EMAIL),
      map((action: fromActions.SignUpEmail) => action.user),
      switchMap(userData =>
        this.httpClient.post<UserResponse>(`${environment.url}api/usuario/registrar`, userData)
          .pipe(
            tap((response: UserResponse) => {
              localStorage.setItem('token', response.token);
              this.router.navigate(['/']);
            }),
            map((response: UserResponse) => new fromActions.SignUpEmailSuccess(response.email, response || null)),
            //catchError(err => of(new fromActions.SignUpEmailError(err.message)))

            catchError(err => {

              this.notification.error("Errores al registrar nuevo usuario");
              return of(new fromActions.SignUpEmailError(err.message))

            })


          )
      )
    )
  );


  signInEmail: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.SIGN_IN_EMAIL),
      map((action: fromActions.SignInEmail) => action.credentials),
      switchMap(credentials =>
        this.httpClient.post<UserResponse>(`${environment.url}api/usuario/login`, credentials)
          .pipe(
            tap((response: UserResponse) => {
              localStorage.setItem('token', response.token);
              this.router.navigate(['/']);
            }),
            // This is where your store gets the data to update the state!
            // The data is the response from the server
            map((response: UserResponse) => new fromActions.SignInEmailSuccess(response.email, response || null)),
            catchError(err => {

              this.notification.error("Credenciales incorrectas");
              return of(new fromActions.SignInEmailError(err.message))

            })

          )
      )
    )
  );

  //this effect listens to the INIT action and reads the token from localStorage
  //if the token exists, it makes a request to the server to get the user data
  init: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.INIT),
      switchMap(async () => localStorage.getItem('token')),
      switchMap(token => {
        //if the token exists, make a request to the server to get the user data
        if (token) {
          return this.httpClient.get<UserResponse>(`${environment.url}api/usuario`)
            .pipe(
              // tap is used to perform side effects, like logging the user data
              tap((user: UserResponse) => {
                console.log('data del usuario en sesion que viene del servidor=>', user);
              }),
              //On success: Dispatch InitAuthorized with user data
              map((user: UserResponse) => new fromActions.InitAuthorized(user.email, user || null)),
              catchError(err => of(new fromActions.InitError(err.message)))
            )
        } else {
          return of(new fromActions.InitUnauthorized());
        }
      }
      )
    )
  );


  forgotPassword: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.FORGOT_PASSWORD),
      map((action: fromActions.ForgotPassword) => action.payload),
      switchMap(({ email, clientUri }) =>
        this.httpClient.post(`${environment.url}api/usuario/forgotpassword`, {
          email,
          clientUri
        }).pipe(
          map(() => new fromActions.ForgotPasswordSuccess()),
          catchError(err => of(new fromActions.ForgotPasswordError(err.message)))
        )
      )
    )
  );


  forgotPasswordSuccessNotify = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.FORGOT_PASSWORD_SUCCESS),
      tap(() => {
        this.notification.success('Enlace de restablecimiento enviado al correo electrónico');
        this.router.navigate(['/auth/login']);
      })
    ),
    { dispatch: false }
  );

  forgotPasswordErrorNotify = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.FORGOT_PASSWORD_ERROR),
      tap((action: fromActions.ForgotPasswordError) => {
        this.notification.error(`Error al enviar el enlace: ${action.error}`);
      })
    ),
    { dispatch: false }
  );

  resetPassword: Observable<Action> = createEffect((): Observable<Action> =>
  this.actions.pipe(
    ofType(fromActions.Types.RESET_PASSWORD),
    map((action: fromActions.ResetPassword) => action.payload),
    switchMap(({ email, token, password }) =>
      this.httpClient.post(`${environment.url}api/usuario/resetpassword`, {
        Email: email,
        Token: token,
        NewPassword: password
      }, { observe: 'response', responseType: 'text' }).pipe( // observe full response
        map(response => {
          if (response.status === 200) {
            return new fromActions.ResetPasswordSuccess();
          } else {
            return new fromActions.ResetPasswordError('Respuesta inesperada del servidor');
          }
        }),
        catchError(err => {
          const errorMessage = Array.isArray(err.error)
            ? err.error.join(', ')
            : err.error || 'Error desconocido';
          return of(new fromActions.ResetPasswordError(errorMessage));
        })
      )
    )
  )
);


  resetPasswordSuccessNotify = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.RESET_PASSWORD_SUCCESS),
      tap(() => {
        this.notification.success('Contraseña restablecida con éxito');
        this.router.navigate(['/auth/login']);
      })
    ),
    { dispatch: false }
  );

  resetPasswordErrorNotify = createEffect(() =>
    this.actions.pipe(
      ofType(fromActions.Types.RESET_PASSWORD_ERROR),
      tap((action: fromActions.ResetPasswordError) => {
        this.notification.error(`Error al restablecer la contraseña: ${action.error}`);
      })
    ),
    { dispatch: false }
  );


}