import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    const rolesRequeridos = next.data['roles'] as Array<string>;
    const usuario = this.authService.getCurrentUser();
    
    if (rolesRequeridos && rolesRequeridos.includes(usuario.rol)) {
      return true;
    }
    
    // Redirigir según el rol del usuario
    if (usuario.rol === 'admin') {
      this.router.navigate(['/dashboard']);
    } else if (usuario.rol === 'cliente') {
      this.router.navigate(['/principal']);
    } else {
      this.router.navigate(['/login']);
    }
    
    return false;
  }
}