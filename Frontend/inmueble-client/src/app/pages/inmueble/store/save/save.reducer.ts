import { InmuebleResponse } from './save.models';
import * as fromActions from './save.actions';

export interface ListState {
  inmuebles: InmuebleResponse[] | null;
  inmueble: InmuebleResponse | null;
  loading: boolean | null;
  error: string | null;
}

export const initialState: ListState = {
  inmuebles: null,
  inmueble: null,
  loading: null,
  error: null
}


export function reducer(state: ListState = initialState, action: fromActions.All | any) {
  // the action object contains the type and the payload
  // the type is the action type and the payload is the data that we want to send to the reducer
  // this data contains errors, inmuebles, inmueble, etc
  switch (action.type) {

    case fromActions.Types.CREATE: {
      return { ...state, loading: true, error: null }
    }

    case fromActions.Types.CREATE_SUCCESS: {
      return { ...state, loading: false, error: null, inmueble: action.inmueble }
    }

    case fromActions.Types.CREATE_ERROR: {
      return { ...state, loading: false, error: action.error }
    }

    case fromActions.Types.UPDATE: {
      return { ...state, loading: true, error: null }
    }
    
    case fromActions.Types.UPDATE_SUCCESS: {
      return { ...state, loading: false, error: null, inmueble: action.inmueble }
    }

    case fromActions.Types.UPDATE_ERROR: {
      return { ...state, loading: false, error: action.error }
    }

    case fromActions.Types.READ: {
      return { ...state, loading: true, error: null }
    }

    case fromActions.Types.READ_SUCCESS: {
      return { ...state, loading: false, inmuebles: action.inmuebles }
    }

    case fromActions.Types.READ_ERROR: {
      return { ...state, loading: false, error: action.error }
    }

    case fromActions.Types.READ_ONE: {
      return { ...state, loading: true, error: null }
    }

    case fromActions.Types.READ_ONE_SUCCESS: {
      return { ...state, loading: false, inmueble: action.inmueble }
    }

    case fromActions.Types.READ_ONE_ERROR: {
      return { ...state, loading: false, error: action.error }
    }

    case fromActions.Types.CLEAR_INMUEBLE: {
      return { ...state, inmueble: null }
    }


    default: {
      return state;
    }
  }


}