import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {jwtDecode} from 'jwt-decode'; // Añade esta librería

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    const token = this.authService.getToken();
    
    // 1. Si no hay token, redirigir al login
    if (!token) {
      this.redirectToLogin();
      return false;
    }
    
    // 2. Verificar si el token está expirado
    if (this.isTokenExpired(token)) {
      this.authService.logout();
      this.redirectToLogin();
      return false;
    }
    
    return true;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate < new Date();
    } catch (error) {
      return true; // Si hay error al decodificar, considerar expirado
    }
  }

  private redirectToLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}