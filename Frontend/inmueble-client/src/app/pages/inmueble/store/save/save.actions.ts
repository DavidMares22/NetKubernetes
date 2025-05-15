import {Action} from '@ngrx/store';
import {InmuebleCreateRequest, InmuebleResponse, InmuebleUpdateRequest} from './save.models';


export enum Types {
  CREATE = '[Inmueble] Create: Start',
  CREATE_SUCCESS = '[Inmueble] Create: Success',
  CREATE_ERROR = '[Inmueble] Create: Error',

  READ = '[Inmueble] Read',
  READ_SUCCESS = '[Inmueble] Read:Success',
  READ_ERROR = '[Inmueble] Read:Error',

  DELETE = '[Inmueble] Delete',
  DELETE_SUCCESS = '[Inmueble] Delete:Success',
  DELETE_ERROR = '[Inmueble] Delete:Error',

  UPDATE = '[Inmueble] Update',
  UPDATE_SUCCESS = '[Inmueble] Update:Success',
  UPDATE_ERROR = '[Inmueble] Update:Error',

  READ_ONE = '[Inmueble] Read One',
  READ_ONE_SUCCESS = '[Inmueble] Read One:Success', 
  READ_ONE_ERROR = '[Inmueble] Read One:Error',

  CLEAR_INMUEBLE = '[Inmueble] Clear Inmueble',

}

export class Read implements Action {
  readonly type = Types.READ;
  constructor(){}
}

export class ReadSuccess implements Action {
  readonly type = Types.READ_SUCCESS;
  constructor(public inmuebles: InmuebleResponse[]){}
}

export class ReadError implements Action {
  readonly type = Types.READ_ERROR;
  constructor(public error: string){}
}
export class ReadOne implements Action {
  readonly type = Types.READ_ONE;
  constructor(public id: number){}
}

export class ReadOneSuccess implements Action {
  readonly type = Types.READ_ONE_SUCCESS;
  constructor(public inmueble: InmuebleResponse){}
}

export class ReadOneError implements Action {
  readonly type = Types.READ_ONE_ERROR;
  constructor(public error: string){}
}



export class Create implements Action {
  readonly type = Types.CREATE;
  constructor(public inmueble: InmuebleCreateRequest){}
}


export class CreateSuccess implements Action {
  readonly type = Types.CREATE_SUCCESS;
  constructor(public inmueble: InmuebleResponse){}
}

export class CreateError implements Action {
  readonly type = Types.CREATE_ERROR;
  constructor(public error: string) {}
}
export class Update implements Action {
  readonly type = Types.UPDATE;
  constructor(public id: number,public inmueble: InmuebleUpdateRequest){}
}
export class UpdateSuccess implements Action {
  readonly type = Types.UPDATE_SUCCESS;
  constructor(public inmueble: InmuebleResponse){}
}

export class UpdateError implements Action {
  readonly type = Types.UPDATE_ERROR;
  constructor(public error: string) {}
}

export class ClearInmueble implements Action {
  readonly type = Types.CLEAR_INMUEBLE;
  constructor() {}
}

export type All =
  Read
| ReadSuccess
| ReadError
| ReadOne
| ReadOneSuccess
| ReadOneError
| Update
| UpdateSuccess
| UpdateError
| ClearInmueble
| Create | CreateSuccess | CreateError;

