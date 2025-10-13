import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-Alerta',
  templateUrl: 'Alerta.page.html',
  styleUrls: ['Alerta.page.scss'],
  standalone: false,
})
export class AlertaPage {
  alertas: any[] = [];

  // Campos del formulario minimalistas (puedes ampliarlos)
  solicitante: string = '';
  telefono: string = '';
  direccion: string = '';
  villa: string = '';
  cuadrante: string = '';
  requerimiento: string = '';
  clasificacion: string = '';
  detalle: string = '';
  derivacion: string = '';
  visibilidadCamaras: string = 'No';

  constructor(private toastCtrl: ToastController) {
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

  // Crear y guardar alerta
  async createAlerta() {
    const now = new Date();
    const fecha = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const hora = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const alerta = {
      ID: Math.floor(Math.random() * 100000),
      N: 1,
      OPERADOR1: localStorage.getItem('nombreUsuario') || '-',
      OPERADOR2: '-',
      FECHA: fecha,
      HORA_DEL_EVENTO: hora,
      SOLICITANTE: this.solicitante,
      TELEFONO: this.telefono,
      DIRECCION: this.direccion,
      VILLA_O_POBLACION: this.villa,
      CUADRANTE: this.cuadrante,
      REQUERIMIENTO: this.requerimiento,
      CLASIFICACION: this.clasificacion,
      DETALLE: this.detalle,
      DERIVACION: this.derivacion,
      DERIVACIONES_ADICIONALES: '',
      HORA_DE_DERIVACION: '',
      VISIBILIDAD_EN_CAMARAS: this.visibilidadCamaras,
      CONDUCTOR: '',
      MOVIL1: '',
      CONDUCTOR2: '',
      MOVIL2: '',
      CONDUCTOR3: '',
      MOVIL3: '',
      HORA_LLEGADA_MOVIL: '',
      LABOR_REALIZADA: '',
      TERMINO_DEL_EVENTO: '',
      MES: now.toLocaleString('es-CL', { month: 'long' }),
      DIA_SEMANA: now.toLocaleString('es-CL', { weekday: 'long' }),
      TIPO_DIA: 'Dia laboral',
      TURNO: localStorage.getItem('turno') || 'Turno .3',
      TIEMPO_DE_REACCION: '',
      TIEMPO_DE_GESTION: '',
      TIEMPO_TOTAL: '',
      FAMILIA: '',
    };

    const arr = JSON.parse(localStorage.getItem('alertas') || '[]');
    arr.push(alerta);
    localStorage.setItem('alertas', JSON.stringify(arr));
    this.alertas = arr;

    const t = await this.toastCtrl.create({ message: 'Alerta creada', duration: 2000 });
    await t.present();
  }
}
