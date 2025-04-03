import { createSelector, createFeatureSelector } from "@ngrx/store";
import { UserState } from './user.reducer';

// Feature Selector: Retrieves the 'user' slice of the state from the global store
export const getUserState = createFeatureSelector<UserState>('user');

// Selector: Retrieves the 'entity' property from the 'user' state
// This typically contains the full user object (e.g., name, email, etc.)
export const getUser = createSelector(
  getUserState,
  (state) => state.entity
);

// Selector: Retrieves the 'loading' property from the 'user' state
// Indicates whether a user-related operation (e.g., login, registration) is in progress
export const getLoading = createSelector(
  getUserState,
  (state) => state.loading
);

// Selector: Determines if the user is authorized
// Returns true if the 'email' property exists in the 'user' state, false otherwise
// This is used to check if the user is logged in
export const getIsAuthorized = createSelector(
  getUserState,
  (state) => !!state.email
);