import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  // Campos actualizados según el modelo Django
  rut_usuario = '';
  nombre_usuario = '';
  apellido_pat_usuario = '';
  apellido_mat_usuario = '';
  correo_electronico_usuario = '';
  telefono_movil_usuario = '';
  password = '';
  confirmPassword = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.error = '';
    
    // Validación de contraseñas
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    
    // Validación de RUT
    const rutValido = /^\d{7,8}-[\dkK]$/.test(this.rut_usuario);
    if (!rutValido) {
      this.error = 'El RUT debe tener formato: 12345678-9';
      return;
    }
    
    // Validación de teléfono
    const telefonoValido = /^\+?56?9?\d{8}$/.test(this.telefono_movil_usuario);
    if (!telefonoValido) {
      this.error = 'El teléfono debe tener formato: +56912345678 o 912345678';
      return;
    }
    
    // Preparar datos según el modelo Django
    const userData = {
      rut_usuario: this.rut_usuario,
      nombre_usuario: this.nombre_usuario,
      apellido_pat_usuario: this.apellido_pat_usuario,
      apellido_mat_usuario: this.apellido_mat_usuario,
      correo_electronico_usuario: this.correo_electronico_usuario,
      telefono_movil_usuario: this.telefono_movil_usuario,
      password: this.password,
      // Rol Ciudadano con ID=3
      id_rol: 3
    };
    
    this.http.post('http://localhost:8000/api/ionic/register/', userData).subscribe({
      next: (response: any) => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        if (err.error) {
          // Mostrar errores específicos del backend
          if (err.error.rut_usuario) {
            this.error = `RUT: ${err.error.rut_usuario[0]}`;
          } else if (err.error.correo_electronico_usuario) {
            this.error = `Correo: ${err.error.correo_electronico_usuario[0]}`;
          } else if (err.error.telefono_movil_usuario) {
            this.error = `Teléfono: ${err.error.telefono_movil_usuario[0]}`;
          } else if (err.error.non_field_errors) {
            this.error = err.error.non_field_errors[0];
          } else {
            this.error = 'Error al registrar usuario. Verifique los datos.';
          }
        } else {
          this.error = 'Error de conexión con el servidor';
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}