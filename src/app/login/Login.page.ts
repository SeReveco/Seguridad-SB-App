import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service'; // 👈 Importa tu servicio

@Component({
  selector: 'app-Login',
  templateUrl: './Login.page.html',
  styleUrls: ['./Login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  nombreUsuario: string = '';

  constructor(
    private router: Router,
    private apiService: ApiService // 👈 Inyectamos el servicio
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    // ✅ Llamamos a Django para autenticar
    this.apiService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        // Guardamos tokens
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);

        // Extraer nombre de usuario del correo
        this.nombreUsuario = this.email.split('@')[0];
        localStorage.setItem('nombreUsuario', this.nombreUsuario);

        console.log('Login exitoso ✅', res);

        // Redirigir según el correo (tu lógica)
        if (this.email.toLowerCase().endsWith('@sanbernardo.cl')) {
          this.router.navigate(['/movil']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Error en login ❌', err);
        this.errorMessage = 'Credenciales inválidas.';
      }
    });
  }


  goToHome() {
    this.router.navigate(['/home']);
  }
}
