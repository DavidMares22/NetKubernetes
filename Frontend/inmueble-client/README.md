# InmuebleClient

This is the frontend application for the **InmuebleClient** project, built with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.3. The application provides a user interface for managing properties and user authentication.

---

## Table of Contents
- [Getting Started](#getting-started)
- [Development Server](#development-server)
- [Build](#build)
- [Environment Configuration](#environment-configuration)
- [Component Communication Using RxJS State](#component-communication-using-rxjs-state)

---

## Getting Started

### NgRx

We use NgRx for organized data management across our app. It's like a single source of truth that all parts of our application can easily access and update.

-   **Actions** - Simple messages telling our app what happened (e.g., "add item," "load data"). They have a `type` and can include extra info.

-   **Effects** - These handle the "behind-the-scenes" work like fetching data from the internet. They listen for Actions and then trigger these tasks, often sending new Actions when done.

-   **Reducer** - A pure function that decides how the app's data (state) changes based on an Action. It takes the current data and an Action, then returns the updated data. It never changes the old data directly.

-   **Store** - The central place where all our app's data lives. It receives Actions and uses Reducers to update the data. When the data changes, it lets all the interested parts of our app know.

- **Selector** - The selector can retrive part of the state from the store when a Component needs it


![](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F54856k8gqn4ovmph823c.png "NgRx State Management Lifecycle")



## Development Server

Run the following command to start the development server:
```bash
ng serve
```
Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

---

## Build

To build the project for production, run:
```bash
ng build --configuration production
```
The build artifacts will be stored in the `dist/` directory.

---

## Environment Configuration

The `environment.ts` file is not included in the repository for security reasons. Below is an example of how your `environment.ts` file should look:

```typescript
// filepath: src/environments/environment.ts
export const environment = {
  production: false,
  name: 'dev',
  firebase: {
    config: {
      apiKey: "your-firebase-api-key",
      authDomain: "your-firebase-auth-domain",
      projectId: "your-firebase-project-id",
      storageBucket: "your-firebase-storage-bucket",
      messagingSenderId: "your-firebase-messaging-sender-id",
      appId: "your-firebase-app-id"
    }
  },
  url: 'http://localhost:5000/', // Backend API base URL
};
```

For production, create a `environment.prod.ts` file with the appropriate values.

---

## Component Communication Using RxJS State

### Overview
In this project, components communicate with each other using **RxJS state management**. Shared services are used to manage state and provide observables that components can subscribe to. This approach ensures a reactive and decoupled architecture.

### How It Works
1. **Shared Services**:
   - A shared service acts as a central store for managing state using RxJS subjects like `BehaviorSubject` or `ReplaySubject`.
   - Components can update the state by calling methods in the service, and other components can subscribe to the state to reactively update their data.

2. **State Flow**:
   - **State Update**: A component (e.g., a login form) updates the state by calling a method in the shared service.
   - **State Subscription**: Another component (e.g., a header) subscribes to the state observable to receive updates whenever the state changes.

3. **Advantages**:
   - **Reactive Updates**: Components automatically update when the state changes.
   - **Decoupled Communication**: Components don't need to directly reference each other.
   - **Centralized State**: Shared services act as a single source of truth for specific pieces of state.

---

### Example: Shared State with RxJS

#### 1. **Create a Shared Service**
The shared service acts as a central store for managing state using RxJS `BehaviorSubject` or `ReplaySubject`.

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private userSubject = new BehaviorSubject<User | null>(null);

  // Observable for components to subscribe to
  user$: Observable<User | null> = this.userSubject.asObservable();

  // Update the user state
  setUser(user: User | null): void {
    this.userSubject.next(user);
  }

  // Clear the user state
  clearUser(): void {
    this.userSubject.next(null);
  }
}
```

#### 2. **Update State in One Component**
A component (e.g., login form) updates the state when the user logs in:
```typescript
import { Component } from '@angular/core';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(private userStateService: UserStateService) {}

  onLogin(user: User): void {
    this.userStateService.setUser(user); // Update the user state
  }
}
```

#### 3. **Subscribe to State in Another Component**
Another component (e.g., header) subscribes to the state to display user information:
```typescript
import { Component, OnInit } from '@angular/core';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  user: User | null = null;

  constructor(private userStateService: UserStateService) {}

  ngOnInit(): void {
    this.userStateService.user$.subscribe(user => {
      this.user = user; // Reactively update the user data
    });
  }
}
```

---

### Advanced Communication Using NgRx Store

For more complex state management, this project uses **NgRx Store**. The store is organized into the following folders:
- **Actions**: Define events that describe state changes.
- **Effects**: Handle side effects like API calls.
- **Models**: Define TypeScript interfaces for the state and data structures.
- **Reducer**: Specify how the state changes in response to actions.
- **Selectors**: Provide reusable functions to query specific slices of the state.

This architecture ensures a predictable and scalable state management system.

#### Example: User Authentication State

1. **Actions**:
   ```typescript
   export const login = createAction('[Auth] Login', props<{ credentials: { email: string; password: string } }>());
   export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User }>());
   export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());
   ```

2. **Reducer**:
   ```typescript
   export const userReducer = createReducer(
     initialState,
     on(UserActions.login, state => ({ ...state, loading: true })),
     on(UserActions.loginSuccess, (state, { user }) => ({ ...state, user, loading: false })),
     on(UserActions.loginFailure, (state, { error }) => ({ ...state, loading: false, error }))
   );
   ```

3. **Selectors**:
   ```typescript
   export const selectUser = createSelector(selectUserState, state => state.user);
   ```

4. **Effects**:
   ```typescript
   login$ = createEffect(() =>
     this.actions$.pipe(
       ofType(UserActions.login),
       switchMap(action =>
         this.authService.login(action.credentials).pipe(
           map(user => UserActions.loginSuccess({ user })),
           catchError(error => of(UserActions.loginFailure({ error: error.message })))
         )
       )
     )
   );
   ```

 