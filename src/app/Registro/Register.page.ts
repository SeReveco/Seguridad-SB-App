import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Register',
  templateUrl: './Register.page.html',
  styleUrls: ['./Register.page.scss'],
  standalone: false
})
export class RegisterPage {
  nombre = '';
  apellido = '';
  password = '';
  confirmPassword = '';
  correo = '';
  telefono = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.error = '';
    // Validación de contraseñas
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    // Validación de teléfono
    const telefonoValido =
      (/^\+569\d{8}$/.test(this.telefono) && this.telefono.length === 12) ||
      (/^9\d{8}$/.test(this.telefono) && this.telefono.length === 9);
    if (!telefonoValido) {
      this.error = 'El teléfono debe ser +569XXXXXXXX (12) o 9XXXXXXXX (9)';
      return;
    }
    this.http.post('http://localhost:8000/api/register/', {
      nombre: this.nombre,
      apellido: this.apellido,
      password: this.password,
      correo: this.correo,
      telefono: this.telefono
    }).subscribe({
      next: () => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'Error al registrar usuario';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
