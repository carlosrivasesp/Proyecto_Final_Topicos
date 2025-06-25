import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; 
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);
  signupForm!: FormGroup;
  formSubmitted = false;
  tipoDocSeleccionado: string = '';

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), this.onlyLettersValidator]],
    //apellido: ['', [Validators.required, Validators.minLength(3), this.onlyLettersValidator]],
      tipoDoc: ['', Validators.required],
      nroDoc: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      correo: ['', [Validators.required, Validators.email, this.correoPermitidoValidator]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmarPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

      // Validación dinámica de nroDoc
  this.signupForm.get('tipoDoc')?.valueChanges.subscribe(tipo => {
     this.tipoDocSeleccionado = tipo;
    const nroDocControl = this.signupForm.get('nroDoc');

    if (tipo === 'dni') {
      nroDocControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{8}$/)
      ]);
    } else if (tipo === 'ruc') {
      nroDocControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{11}$/)
      ]);
    } else {
      nroDocControl?.setValidators([Validators.required]);
    }

    nroDocControl?.updateValueAndValidity();
  });

  }


  
  // Validador personalizado para solo letras
  onlyLettersValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) ? null : { onlyLetters: true };
  }

  // Validador de fortaleza de contraseña
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    return valid ? null : { passwordStrength: true };
  }

  // Validador para coincidencia de contraseñas
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmarPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
// Validador para correos de tipo @gmail.com, @hotmail.com o @outlook.es.
  correoPermitidoValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const dominiosPermitidos = ['@gmail.com', '@hotmail.com', '@outlook.es'];
  const dominio = value.substring(value.lastIndexOf('@'));

  return dominiosPermitidos.includes(dominio) ? null : { correoNoPermitido: true };
}

registrar() {
  this.formSubmitted = true;

  if (this.signupForm.valid) {
    const usuario = this.signupForm.value;
    this.authService.registrarUsuario(usuario).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        //alert('Registro exitoso');
        this.toastr.success('Usuario registrado exitosamente', 'Registro exitoso');
        this.signupForm.reset();
        this.formSubmitted = false;
        this.router.navigate(['/login']); // redirige al login

      },
error: (err) => {
  console.error('Error al registrar:', err);

  // Extraer el mensaje de error del backend
  const mensaje = err.error?.error || 'Ocurrió un error al registrar';

  // Mostrar el popup de error
  this.toastr.error(mensaje, 'Error de registro');
}
    });
  } else {
    console.log('Formulario inválido');
    
  }
}

  // Helper para acceder fácilmente a los controles del formulario
  get f() {
    return this.signupForm.controls;
  }
}