import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user-menu',
  template: `
    <ion-list>
      <ion-item button (click)="login()">Iniciar sesión</ion-item>
      <ion-item button (click)="register()">Registrarse</ion-item>
    </ion-list>
  `
})
export class UserMenuComponent {
  constructor(private modalCtrl: ModalController) {}

  login() {
    // Aquí puedes abrir una página de login o mostrar un mensaje
    this.modalCtrl.dismiss('login');
  }

  register() {
    // Aquí puedes abrir una página de registro o mostrar un mensaje
    this.modalCtrl.dismiss('register');
  }
}
