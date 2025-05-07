import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

   

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenSeguridad = localStorage.getItem('token');

    // if there is no token in local storage, there is no need to add it to the request

    if(!tokenSeguridad) {
      return next.handle(req);
    }

    // if there is a token in local storage, add it to the request
    const request = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${tokenSeguridad}`)
    });

    return next.handle(request);
  }
}