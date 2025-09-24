

import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit {
  mostrarFormulario: boolean = false;
  map: any;

  alertas: any[] = [];

  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).open();
    }
  }

  ngAfterViewInit() {
    this.map = L.map('map').setView([-33.592, -70.700], 13); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  goToUbicacionActual() {
    if (this.map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.map.setView([lat, lng], 17, { animate: true });
          const iconUbicacion = L.icon({
            iconUrl: 'https://unpkg.com/ionicons@5.5.2/dist/svg/locate-outline.svg',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            className: 'ubicacion-marker'
          });
          L.marker([lat, lng], { icon: iconUbicacion }).addTo(this.map);
          this.map.panTo([lat, lng], { animate: true });
        },
        (error) => {
          alert('No se pudo obtener la ubicación actual.');
        }
      );
    } else {
      alert('Geolocalización no soportada.');
    }
  }

  solicitante: string = '';
  telefono: string = '';
  direccion: string = '';
  ubicacion: string = '';
  tipo: string = '';
  descripcion: string = '';

  abrirFormulario() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ubicacion = `${position.coords.latitude}, ${position.coords.longitude}`;
          this.mostrarFormulario = true;
        },
        (error) => {
          this.ubicacion = '';
          this.mostrarFormulario = true;
        }
      );
    } else {
      this.ubicacion = '';
      this.mostrarFormulario = true;
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.solicitante = '';
    this.telefono = '';
    this.direccion = '';
    this.ubicacion = '';
    this.tipo = '';
    this.descripcion = '';
  }

  enviarAlerta() {
    const nombreCuenta = 'Usuario';
    const telefonoCuenta = '999999999';
    const direccionCuenta = 'Sin dirección';

    const solicitanteFinal = this.solicitante.trim() ? this.solicitante : 'Anónimo';
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString();

    if (!this.tipo || !this.descripcion || !this.ubicacion) {
      alert('Por favor, complete tipo, descripción y ubicación.');
      return;
    }
    this.alertas.push({
      solicitante: solicitanteFinal,
      telefono: telefonoCuenta,
      direccion: direccionCuenta,
      ubicacion: this.ubicacion,
      tipo: this.tipo,
      descripcion: this.descripcion,
      fecha,
      hora
    });
    alert('¡Alerta reportada exitosamente!');
    this.cerrarFormulario();
  }
}
