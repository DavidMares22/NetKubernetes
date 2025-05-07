import { createSelector, createFeatureSelector } from "@ngrx/store";
import { UserState } from './user.reducer';

// Feature Selector: Retrieves the 'user' slice of the state from the global store
// 'user' is the key under which the user state is stored in the global state
export const getUserState = createFeatureSelector<UserState>('user');

//“First, get the user slice of the store using getUserState, 
// then from that, return the entity (i.e. the actual user data).”
export const getUser = createSelector(
  getUserState,
  (state) => state.entity
);

 
export const getLoading = createSelector(
  getUserState,
  (state) => state.loading
);

// double negation !! converts the value to a boolean
export const getIsAuthorized = createSelector(
  getUserState,
  (state) => !!state.email
);