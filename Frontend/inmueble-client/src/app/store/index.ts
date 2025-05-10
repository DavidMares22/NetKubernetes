//ActionReducerMap is used to define a mapping between state slices and their reducers.
import { ActionReducerMap } from '@ngrx/store';
//Importing user-related state management
import * as fromUser from './user';

//The app’s state will have a user property, and its shape will be defined by UserState
export interface State {
  user : fromUser.UserState;
}

// You're telling NgRx: "For the user part of the app state, use this reducer function to handle 
// all relevant actions."

export const reducers : ActionReducerMap<State> = {
  user : fromUser.reducer
}

export const effects = [
  fromUser.UserEffects
]