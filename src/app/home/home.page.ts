
import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { AlertaService } from '../services/alerta.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit {
  map: any;

  constructor(private alertaService: AlertaService) {}

  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).open();
    }
  }

  ngAfterViewInit() {
    // Enfoque inicial en San Bernardo, sin límites
    this.map = L.map('map').setView([-33.592, -70.700], 13); // Centro San Bernardo
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  goToSanBernardo() {
    if (this.map) {
      this.map.setView([-33.592, -70.700], 15, { animate: true });
    }
  }

  reportarAlerta() {
    const mensaje = prompt('Describe la alerta:');
    if (mensaje && mensaje.trim()) {
      this.alertaService.agregarAlerta(mensaje.trim());
      alert('¡Alerta reportada!');
    }
  }
}
