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
    
    if (user.es_administrador || user.es_operador) {
      this.router.navigate(['/trabajador']);
    } else if (user.es_conductor) {
      this.router.navigate(['/conductor']);
    } else if (user.es_ciudadano) {
      this.router.navigate(['/ciudadano']);
    } else {
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

  fillTestCredentials() {
    this.email = 'admin@sanbernardo.cl';
    this.password = 'password123';
    this.errorMessage = 'Credenciales de prueba cargadas. Haz click en Ingresar.';
  }
}