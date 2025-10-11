import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Trabajador',
  templateUrl: 'trabajador.page.html',
  styleUrls: ['trabajador.page.scss'],
  standalone: false,
})
export class TrabajadorPage implements OnInit {
  nombreUsuario: string | null = null;
  workOption: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.cargarTrabajador();
  }

  cargarTrabajador() {
    this.nombreUsuario = localStorage.getItem('nombreUsuario');
    this.workOption = localStorage.getItem('workOption');
  }

  selectWorkOption(option: string) {
    this.workOption = option;
    localStorage.setItem('workOption', option);
    // Mantener en la página para que el usuario pueda cambiar o continuar
  }

  // Ir a la pantalla principal cuando el trabajador esté listo
  startTrabajo() {
    this.router.navigate(['/home']);
  }

  // Permitir al usuario cambiar vehículo (resetear la selección)
  changeVehicle() {
    this.workOption = null;
    localStorage.removeItem('workOption');
  }
}
