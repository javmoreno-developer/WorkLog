import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  ActivatedRoute
} from '@angular/router';
import { ApiService } from '@worklog-fe/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
​
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private api:ApiService,
    private router:Router,
  ){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
     
      if(localStorage.getItem("sessionData") == null) {
         this.router.navigate(['login']);
         return true
      } else {
        return true
      }
  }
  
}