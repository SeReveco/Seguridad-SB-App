import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
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
  todayRole: string | null = null;
  vehicles: Array<{ key: string; label: string; icon?: string; img?: string; faIcon?: string }> = [
    { key: 'Auto', label: 'Auto', faIcon: 'fas fa-car' },
    { key: 'Moto', label: 'Motocicleta', faIcon: 'fas fa-motorcycle' },
    { key: 'Camioneta', label: 'Camioneta', img: 'assets/Img/Camioneta-Silueta.png' },
    { key: 'Bicicleta', label: 'Bicicleta', faIcon: 'fas fa-bicycle' },
  ];
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
  radioFrequency: string | null = null;
  vehicleNumber: string | null = null;
  @ViewChild('vehicleNumberInput', { static: false }) vehicleInput: IonInput | undefined;

  constructor(private router: Router, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.cargarTrabajador();
    const freq = localStorage.getItem('radioFrequency');
    if (freq) this.radioFrequency = freq;
    const role = localStorage.getItem('todayRole');
    if (role) this.todayRole = role;
    const vnum = localStorage.getItem('vehicleNumber');
    if (vnum) this.vehicleNumber = vnum;
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
    // esperar que el *ngIf renderice el input y luego darle foco
    setTimeout(() => {
      try {
        this.vehicleInput?.setFocus();
      } catch (e) {
        // ignore
      }
    }, 200);
  }

  // Manejo del rol seleccionado
  onRoleChange(ev: any) {
    // ev.detail ? ev.detail.value : ev
    const value = ev && ev.detail && ev.detail.value ? ev.detail.value : ev;
    this.todayRole = value;
    if (this.todayRole) localStorage.setItem('todayRole', this.todayRole);
  }

  // Establecer rol mediante botones
  setRole(role: string) {
    this.todayRole = role;
    if (role) localStorage.setItem('todayRole', role);
  }

  toggleRole(role: string) {
    if (this.todayRole === role) {
      // deseleccionar
      this.todayRole = null;
      localStorage.removeItem('todayRole');
    } else {
      this.todayRole = role;
      localStorage.setItem('todayRole', role);
    }
  }

  // Número del vehículo
  onVehicleNumberChange(val: string) {
    this.vehicleNumber = val;
    if (val) localStorage.setItem('vehicleNumber', val);
  }

  // Ir a la pantalla principal cuando el trabajador esté listo
  startTrabajo() {
    // Guardar la frecuencia y la selección en localStorage
    if (this.radioFrequency) {
      localStorage.setItem('radioFrequency', this.radioFrequency);
    }
    if (this.workOption) {
      localStorage.setItem('workOption', this.workOption);
    }

    // Generar asignación siempre que tengamos lo necesario
    this.generateAsignacion();
    this.presentToast('Turno iniciado. Datos guardados.');
    // Navegar al mapa (home) para iniciar operaciones en campo
    this.router.navigate(['/home']);
  }

  // Validar frecuencia: permitir números, letras y algunos símbolos sencillos (ej: '/', '-') y longitud 2-6
  isFrequencyValid(): boolean {
    if (!this.radioFrequency) return false;
    const v = this.radioFrequency.trim();
    return /^[0-9A-Za-z\/-]{2,6}$/.test(v);
  }

  // Determina si se puede iniciar el turno
  isReadyToStart(): boolean {
    // requires role, workOption, valid frequency and optionally valid vehicle number when vehicle selected
    if (!this.todayRole) return false;
    if (!this.workOption) return false;
    if (!this.isFrequencyValid()) return false;
    // if vehicle selected, ensure vehicleNumber is present and valid
    if (this.workOption && !this.isVehicleNumberValid()) return false;
    return true;
  }

  // Validar número de vehículo: permitir números y letras, 1-10 caracteres
  isVehicleNumberValid(): boolean {
    if (!this.workOption) return true; // no requiere número si no hay vehículo
    if (!this.vehicleNumber) return false;
    const v = this.vehicleNumber.trim();
    return /^[0-9A-Za-z-]{1,10}$/.test(v);
  }

  // Seleccionar radio
  selectRadio(r: { label: string; code: string }) {
    this.radioSelected = r;
    localStorage.setItem('radioSelected', JSON.stringify(r));
  }

  // Permitir al usuario escribir la frecuencia manualmente
  onFrequencyChange(value: string) {
    this.radioFrequency = value;
    localStorage.setItem('radioFrequency', value);
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
      NUMERO_MOVIL: this.vehicleNumber || '',
      ROL: this.todayRole || '',
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
