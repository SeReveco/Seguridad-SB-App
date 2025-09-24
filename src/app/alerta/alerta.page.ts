import { Component } from '@angular/core';

@Component({
  selector: 'app-Alerta',
  templateUrl: 'Alerta.page.html',
  styleUrls: ['Alerta.page.scss'],
  standalone: false,
})
export class AlertaPage {
  alertas: any[] = [];

  constructor() {
    this.cargarAlertas();
  }

  cargarAlertas() {
    this.alertas = JSON.parse(localStorage.getItem('alertas') || '[]');
  }


  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).open();
    }
  }
}
