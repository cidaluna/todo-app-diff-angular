// core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private readonly authService: AuthService,
              private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[];
    const currentRole = this.authService.getUserRole();

    if (allowedRoles.includes(currentRole)) {
      return true;
    } else {
      alert('Acesso negado!');
      this.router.navigate(['/']); // ou uma rota de acesso negado
      return false;
    }
  }
}
