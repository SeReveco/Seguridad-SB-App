import { Component } from '@angular/core';

@Component({
  selector: 'app-Motorisado',
  templateUrl: './Motorisado.page.html',
  styleUrls: ['./Motorisado.page.scss'],
  standalone: false,
})
export class MotorisadoPage {
  nombreUsuario: string = '';

  constructor() {
    const nombre = localStorage.getItem('nombreUsuario');
    if (nombre) {
      this.nombreUsuario = nombre;
    }
  }
}
