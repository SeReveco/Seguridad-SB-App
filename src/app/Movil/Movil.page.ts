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