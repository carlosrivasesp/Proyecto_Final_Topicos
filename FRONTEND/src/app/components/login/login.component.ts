import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true, // <-- Este componente es standalone
  imports: [
    CommonModule,     // Necesario para ngClass
    ReactiveFormsModule, // Necesario para formGroup
    RouterModule       // Necesario para routerLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm: FormGroup;
  formSubmitted = false;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

iniciarSesion() {
  this.formSubmitted = true;
  this.errorMessage = null;

  if (this.loginForm.valid) {
    this.isLoading = true;
    const { correo, password } = this.loginForm.value;
    
    this.authService.iniciarSesion(correo, password).subscribe({
      next: () => {
        // La redirección se maneja automáticamente en el servicio
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        
        if (err.status === 0) {
          this.errorMessage = 'Error de conexión con el servidor';
        } else if (err.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos';
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Error desconocido. Intente nuevamente.';
        }
      }
    });
  } else {
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
  // Helper para acceder a los controles (corregido)
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }
}