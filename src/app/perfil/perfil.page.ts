import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as any).open();
    } }

}
