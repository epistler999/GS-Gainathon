import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
} from "@angular/router";

import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class LoginGaurdService {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.isAuthenticated().then((authenticated: boolean) => {
      if (!authenticated) {
        return true;
      } else {
        this.router.navigate(["home"]);
      }
    });
  }
}
