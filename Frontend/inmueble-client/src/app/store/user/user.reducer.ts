import { UserResponse } from './user.models';
import * as fromActions from './user.actions';


//ESTO ES EL STORE

export interface UserState {
  entity: UserResponse | null;
  id: string | null;
  email: string | null;
  loading: boolean | null;
  error: string | null;
}


const initialState: UserState = {
  entity: null,
  id: null,
  email: null,
  loading: null,
  error: null
}
// the reducer function modifies the state and returns a new state
export function reducer(state = initialState, action: fromActions.All | any): UserState {

  switch (action.type) {
    //init
    case fromActions.Types.INIT: {
      return { ...state, loading: true };
    }

    case fromActions.Types.INIT_AUTHORIZED: {
      return { ...state, loading: false, entity: action.user, email: action.email, error: null };
    }
    // if not token in local storage, then the user is unauthorized
    // and the state is reset to initial state
    case fromActions.Types.INIT_UNAUTHORIZED: {
      return { ...state, loading: false, entity: null, email: null, error: null };
    }

    case fromActions.Types.INIT_ERROR: {
      return { ...state, loading: false, entity: null, email: null, error: action.error };
    }

    //login
    case fromActions.Types.SIGN_IN_EMAIL: {
      return { ...state, loading: true, entity: null, email: null, error: null };
    }

    case fromActions.Types.SIGN_IN_EMAIL_SUCCESS: {
      return { ...state, loading: false, entity: action.user, email: action.email, error: null };
    }

    case fromActions.Types.SIGN_IN_EMAIL_ERROR: {
      return { ...state, loading: false, entity: null, email: null, error: action.error };
    }

    //signup o registro de usuarios
    case fromActions.Types.SIGN_UP_EMAIL: {
      return { ...state, loading: true, entity: null, email: null, error: null };
    }

    case fromActions.Types.SIGN_UP_EMAIL_SUCCESS: {
      return { ...state, loading: false, entity: action.user, email: action.email, error: null };
    }

    case fromActions.Types.SIGN_UP_EMAIL_ERROR: {
      return { ...state, loading: false, entity: null, email: null, error: action.error };
    }

    //LOGOUT o Salir de Sesion
    case fromActions.Types.SIGN_OUT_EMAIL: {
      return { ...initialState };
    }

    case fromActions.Types.SIGN_OUT_EMAIL_SUCCESS: {
      return { ...initialState };
    }

    case fromActions.Types.SIGN_OUT_EMAIL_ERROR: {
      return { ...state, loading: false, entity: null, email: null, error: action.error };
    }

    // forgot password
    case fromActions.Types.FORGOT_PASSWORD: {
      return { ...state, loading: true };
    }

    case fromActions.Types.FORGOT_PASSWORD_SUCCESS:
    case fromActions.Types.FORGOT_PASSWORD_ERROR: {
      return { ...state, loading: false };
    }

    case fromActions.Types.RESET_PASSWORD: {
      return { ...state, loading: true };
    }

    case fromActions.Types.RESET_PASSWORD_SUCCESS: {
      return { ...state, loading: false };
    }

    case fromActions.Types.RESET_PASSWORD_ERROR: {
      return { ...state, loading: false, error: action.error };
    }



    default: {
      return state;
    }
  }
}