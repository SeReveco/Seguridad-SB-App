import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-Solicitud',
  templateUrl: './Solicitud.page.html',
  styleUrls: ['./Solicitud.page.scss'],
  standalone: false
})
export class SolicitudPage {

  nombre = '';
  apellido = '';
  rut = '';
  correo = '';
  telefono = '';
  descripcion = '';
  error = '';

  constructor(private http: HttpClient, private apiService: ApiService) {
    // Autocompletar datos del usuario desde ApiService (simulación)
    const usuario = this.apiService.getUsuario();
    this.nombre = usuario?.nombre || '';
    this.apellido = usuario?.apellido || '';
    this.rut = usuario?.rut || '';
    this.correo = usuario?.correo || '';
    this.telefono = usuario?.telefono || '';
    this.descripcion = '';
  }

  // ...existing code...

  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).open();
    }
  }

  enviarSolicitud() {
    this.error = '';
    // Validación de teléfono
    const telefonoValido =
      (/^\+569\d{8}$/.test(this.telefono) && this.telefono.length === 12) ||
      (/^9\d{8}$/.test(this.telefono) && this.telefono.length === 9);
    if (!telefonoValido) {
      this.error = 'El teléfono debe ser +569XXXXXXXX (12) o 9XXXXXXXX (9)';
      return;
    }
    this.http.post('http://localhost:8000/api/solicitud/', {
      nombre: this.nombre,
      apellido: this.apellido,
      rut: this.rut,
      correo: this.correo,
      telefono: this.telefono,
      descripcion: this.descripcion
    }).subscribe({
      next: () => {
        alert('Solicitud enviada correctamente');
        this.nombre = '';
        this.apellido = '';
        this.telefono = '';
        this.correo = '';
        this.descripcion = '';
      },
      error: (err) => {
        this.error = 'Error al enviar la solicitud';
      }
    });
  }
}
