import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    // Simulación: obtener nombre del usuario desde el correo
    if (this.email.endsWith('@SanBernardo.cl')) {
      this.nombreUsuario = this.email.split('@')[0];
      localStorage.setItem('nombreUsuario', this.nombreUsuario);
      this.router.navigate(['/movil']);
    } else if (this.email.endsWith('@gmail.com') || this.email.endsWith('@hotmail.com')) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Correo no válido.';
    }
  }

  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).open();
    }
  }
}
