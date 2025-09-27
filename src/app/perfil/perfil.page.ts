import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  usuario = {
    nombre: 'Usuario Ejemplo',
    telefono: '123456789',
    correo: 'usuario@ejemplo.com'
  };

  constructor() { }

  ngOnInit() {
    // Aquí podrías cargar los datos reales del usuario
  }

  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).open();
    }
  }

}
