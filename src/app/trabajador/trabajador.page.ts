import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-Trabajador',
  templateUrl: 'trabajador.page.html',
  styleUrls: ['trabajador.page.scss'],
  standalone: false,
})
export class TrabajadorPage implements OnInit {
  nombreUsuario: string | null = null;
  workOption: string | null = null;
  // Lista de radios disponibles
  radios: Array<{ label: string; code: string }> = [
    { label: '61', code: 'SC7' },
    { label: '63', code: 'SC4' },
    { label: '64', code: '621' },
    { label: '66', code: '560' },
    { label: '67', code: 'SC6' },
    { label: '72', code: 'SC3' },
    { label: '73', code: 'SC13' },
    { label: '74', code: 'SC1' },
    { label: '89', code: 'SC10' },
    { label: '90', code: 'SC19' },
    { label: '91', code: 'SC20' },
    { label: '92', code: 'SC14' },
    { label: '98', code: 'SC5' },
    { label: '99', code: 'SC17' },
    { label: '100', code: '623/' },
    { label: '102', code: '626' },
    { label: '103', code: '624/' },
    { label: '104', code: '629/SC30' },
    { label: '105', code: '627' },
    { label: '106', code: 'SC16' },
    { label: '107', code: '625/SC26' },
    { label: '111', code: 'SC15' },
    { label: '112', code: '620/SC21' },
    { label: '113', code: '348' },
    { label: 'ECO1', code: '628' },
    { label: 'ECO2', code: 'SC18' },
    { label: 'ECO3', code: 'SC15' },
    { label: 'ECO4', code: 'SC12' },
  ];
  radioSelected: { label: string; code: string } | null = null;

  constructor(private router: Router, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.cargarTrabajador();
  }

  cargarTrabajador() {
    this.nombreUsuario = localStorage.getItem('nombreUsuario');
    this.workOption = localStorage.getItem('workOption');
    const radioJson = localStorage.getItem('radioSelected');
    if (radioJson) {
      try {
        this.radioSelected = JSON.parse(radioJson);
      } catch {
        this.radioSelected = null;
      }
    }
  }

  selectWorkOption(option: string) {
    this.workOption = option;
    localStorage.setItem('workOption', option);
    // Mantener en la página para que el usuario pueda cambiar o continuar
  }

  // Ir a la pantalla principal cuando el trabajador esté listo
  startTrabajo() {
    // Si el trabajador tomó un Auto y hay radio seleccionada, generar asignación
    if (this.workOption && this.workOption.toLowerCase().includes('auto') && this.radioSelected) {
      this.generateAsignacion();
      this.presentToast('Asignación generada y guardada.');
    }
    this.router.navigate(['/home']);
  }

  // Seleccionar radio
  selectRadio(r: { label: string; code: string }) {
    this.radioSelected = r;
    localStorage.setItem('radioSelected', JSON.stringify(r));
  }

  // Cambiar radio (reset)
  changeRadio() {
    this.radioSelected = null;
    localStorage.removeItem('radioSelected');
  }

  // Genera la estructura de asignación y la guarda en localStorage
  generateAsignacion() {
    const now = new Date();
    const fecha = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const hora = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const asignacion = {
      OPERADOR1: this.nombreUsuario || '-',
      OPERADOR2: '-',
      FECHA: fecha,
      TURNO: localStorage.getItem('turno') || 'Turno .3',
      HORA: hora,
      CONDUCTOR: this.nombreUsuario || '-',
      MOVIL: this.workOption || '-',
      PORTATIL: this.radioSelected?.label || '',
      CODIGO_RADIO: this.radioSelected?.code || '',
      LLAVES: '',
      CUADRANTE: '',
      OBSERVACION: 'Término',
    };

    const arr = JSON.parse(localStorage.getItem('asignaciones') || '[]');
    arr.push(asignacion);
    localStorage.setItem('asignaciones', JSON.stringify(arr));
    localStorage.setItem('ultimaAsignacion', JSON.stringify(asignacion));
  }

  async presentToast(message: string) {
    const t = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await t.present();
  }

  // Permitir al usuario cambiar vehículo (resetear la selección)
  changeVehicle() {
    this.workOption = null;
    localStorage.removeItem('workOption');
  }
}
