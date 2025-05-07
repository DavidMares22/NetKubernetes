import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { select, Store } from "@ngrx/store";
import * as fromRoot  from '@app/store';
import * as fromUser from '@app/store/user';
import { filter, map, Observable, tap } from "rxjs";
import { Injectable } from "@angular/core";



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private router: Router,
    private store: Store<fromRoot.State>
  ){}
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
   return this.check();
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.check();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
     return this.check();
  }

  //check if user is logged in, if not redirect to login page

    private check() : Observable<boolean> {
      // getUserState is a selector that retrieves the user state from the store
      return this.store.pipe(select(fromUser.getUserState)).pipe(
        //only continue when the loading is false
        filter(state => !state.loading),
        //tap is an rxjs operator that allows you to perform side effects
        tap( state => {
            // if user is not logged in, redirect to login page
          if(!state.email){
            this.router.navigate(['auth/login']);
          }
        }),
        //map transforms the data
        // double negation !! converts the value to a boolean
        map(state => !!state.email)
      )
    }





}