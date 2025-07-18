import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar'

import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';

import { FlexLayoutModule } from '@angular/flex-layout';


import { AppComponent } from './app.component';
import { environment } from '@src/environments/environment';
import { IndicatorsModule, PopupsModule } from './shared';

import { NotificationModule } from './services/notification/notification.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { HeaderComponent } from './components/header/header.component';
import { MatButtonModule } from '@angular/material/button';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { effects, reducers } from './store';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor';
import { ConfirmationModule } from './services/confirmation/confirmation.module';


const StoreDevtools = !environment.production ? StoreDevtoolsModule.instrument({maxAge:50}) : [];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuListComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    AngularFireModule.initializeApp(environment.firebase.config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,

    FlexLayoutModule,

    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatToolbarModule,

    IndicatorsModule,
    PopupsModule,
    NotificationModule.forRoot(),
    ConfirmationModule.forRoot(),
    MatSidenavModule,
    StoreDevtools,
    StoreModule.forRoot(reducers, { // <-- NgRx uses the ActionReducerMap here
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability:true
      }
    }),
    EffectsModule.forRoot(effects),
    HttpClientModule
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }