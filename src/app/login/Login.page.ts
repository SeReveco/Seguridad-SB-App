import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LoginResponse } from '../models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  nombreUsuario: string = '';
  loggedIn = false;
  loading = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor ingresa un correo electrónico válido.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      console.log('Intentando login con:', this.email);
      
      const response = await this.apiService.login(this.email, this.password).toPromise();
      
      console.log('Respuesta del servidor:', response);

      if (response && response.success && response.user) {
        this.nombreUsuario = response.user.nombre_usuario;
        this.loggedIn = true;
        
        console.log('Login exitoso. Usuario:', response.user);
        
        setTimeout(() => {
          // Guardar el nombre y email en localStorage para usar en otras vistas
          try {
            localStorage.setItem('nombreUsuario', this.nombreUsuario || '');
            localStorage.setItem('email', this.email || '');
            localStorage.setItem('userRole', response.user?.nombre_rol || '');
          } catch (e) {
            console.warn('No se pudo guardar en localStorage:', e);
          }

          this.redirectByRole(response.user);
        }, 1500);
        
      } else if (response) {
        this.errorMessage = response.error || 'Error en el servidor. Intenta nuevamente.';
      } else {
        this.errorMessage = 'No se recibió respuesta del servidor. Intenta nuevamente.';
      }
      
    } catch (error: any) {
      console.error('Error completo en login:', error);
      
      if (error.status === 0) {
        this.errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
      } else if (error.status === 401) {
        this.errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
      } else if (error.error?.error) {
        this.errorMessage = error.error.error;
      } else {
        this.errorMessage = 'Error inesperado. Intenta nuevamente.';
      }
    } finally {
      this.loading = false;
    }
  }

  private redirectByRole(user: any) {
    console.log('Redirigiendo usuario con rol:', user.nombre_rol);
    console.log('ID del rol:', user.id_rol);
    
    // Ciudadano (id=3) → va al home
    if (user.id_rol === 3) {
      this.router.navigate(['/home']);
    } 
    // Administrador (id=1), Conductor (id=4), Inspector (id=5) → van a trabajador
    else if (user.id_rol === 1 || user.id_rol === 4 || user.id_rol === 5) {
      this.router.navigate(['/trabajador']);
    }
    // Operador (id=2) también va a trabajador por si acaso
    else if (user.id_rol === 2) {
      this.router.navigate(['/trabajador']);
    }
    // Para cualquier otro rol, redirigir al home
    else {
      this.router.navigate(['/home']);
    }
  }

  onInputChange() {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}