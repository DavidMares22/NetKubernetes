import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    // verify request coming from the client and add the token to the request if it exists

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenSeguridad = localStorage.getItem('token');

    if(!tokenSeguridad) {
      return next.handle(req);
    }
    const request = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${tokenSeguridad}`)
    });

    return next.handle(request);
  }
}