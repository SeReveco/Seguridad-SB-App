import { Component } from '@angular/core';

@Component({
  selector: 'app-Movil',
  templateUrl: './Movil.page.html',
  styleUrls: ['./Movil.page.scss'],
  standalone: false,
})
export class MovilPage {
  nombreUsuario: string = '';

  constructor() {
    // Se puede obtener el nombre desde localStorage, un servicio, o parámetros de navegación
    const nombre = localStorage.getItem('nombreUsuario');
    if (nombre) {
      this.nombreUsuario = nombre;
    }
  }

  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).open();
    }
  }
}