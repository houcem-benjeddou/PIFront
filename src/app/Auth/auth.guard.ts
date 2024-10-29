import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../Modules/Services/authentication.service';
import {Role} from "../Modules/Classes/user";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const token = localStorage.getItem('access_token');

    if (token) {
      const roles: string[] = route.data['roles'] as string[];

      if (roles && roles.length > 0) {
        const allowedRoles: Role[] = roles.map(role => Role[role as keyof typeof Role]);

        const hasRequiredRole = await this.authService.roleMatch(allowedRoles);

        if (hasRequiredRole) {
          return true;
        } else {
          this.router.navigate(['/notfound']);
          return false;
        }
      }

      return true;
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
  }
}
