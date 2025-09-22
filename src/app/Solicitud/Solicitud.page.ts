import { Component } from '@angular/core';

@Component({
  selector: 'app-Solicitud',
  templateUrl: './Solicitud.page.html',
  styleUrls: ['./Solicitud.page.scss'],
  standalone: false,
})
export class SolicitudPage {
  // Aquí va la lógica de la vista de solicitud
  constructor() {}

  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).open();
    }
  }
}
