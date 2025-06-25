import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://deploy-server-ferretechsc.onrender.com/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, usuario);
  }

  iniciarSesion(correo: string, password: string): Observable<any> {
    const correoNormalizado = correo.toLowerCase().trim();
    
    return this.http.post(`${this.baseUrl}/login`, { 
      correo: correoNormalizado, 
      password 
    }).pipe(
      tap((res: any) => {
        this.guardarDatosSesion(res);
        this.redirigirSegunRol(res.usuario.rol);
      })
    );
  }

  private redirigirSegunRol(rol: string): void {
    if (rol === 'admin') {
      this.router.navigate(['/dashboard']);
    } else if (rol === 'cliente') {
      this.router.navigate(['/principal']);
    } else {
      console.warn('Rol desconocido:', rol);
      this.router.navigate(['/login']);
    }
  }

  private guardarDatosSesion(res: any): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.usuario));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

getToken(): string | null {
  return localStorage.getItem('token');
}

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.rol === 'admin';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  
}