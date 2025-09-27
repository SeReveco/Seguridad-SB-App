import { Component } from '@angular/core';
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
  telefono = '';
  correo = '';
  descripcion = '';
  error = '';

  constructor(private http: HttpClient) {}

  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).open();
    }
  }

  enviarSolicitud() {
    this.error = '';
    this.http.post('http://localhost:8000/api/solicitud/', {
      nombre: this.nombre,
      apellido: this.apellido,
      rut: this.rut,
      telefono: this.telefono,
      correo: this.correo,
      descripcion: this.descripcion
    }).subscribe({
      next: () => {
        alert('Solicitud enviada correctamente');
        this.nombre = '';
        this.apellido = '';
        this.rut = '';
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
