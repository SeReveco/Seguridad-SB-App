import { Component } from '@angular/core';

@Component({
  selector: 'app-Trabajador',
  templateUrl: 'trabajador.page.html',
  styleUrls: ['trabajador.page.scss'],
  standalone: false,
})
export class TrabajadorPage {
  trabajador: any[] = [];

  constructor() {
    this.cargarTrabajador();
  }

  cargarTrabajador() {
    this.trabajador = JSON.parse(localStorage.getItem('trabajador') || '[]');
  }


  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).open();
    }
  }
}
