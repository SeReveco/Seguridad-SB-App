import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
  standalone: false,
})
export class SolicitudPage implements OnInit {
  nombre = '';
  apellido = '';
  rut = '';
  correo = '';
  telefono = '';
  
  tipoSolicitante = '';
  detalleSolicitud = '';
  direccionSolicitante = '';
  
  // Agregar las propiedades que faltan
  direccion = '';
  descripcion = '';
  error = '';
  loading = false;

  constructor(
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    const usuario = this.apiService.getCurrentUser();
    
    if (usuario) {
      // Para ciudadanos
      if (usuario.user_type === 'ciudadano') {
        this.nombre = usuario.nombre.split(' ')[0] || '';
        this.apellido = usuario.nombre.split(' ').slice(1).join(' ') || '';
        this.rut = usuario.rut || '';
        this.correo = usuario.email || '';
        this.telefono = usuario.telefono || '';
      }
      // Para trabajadores
      else if (usuario.user_type === 'trabajador') {
        this.nombre = usuario.nombre.split(' ')[0] || '';
        this.apellido = usuario.nombre.split(' ').slice(1).join(' ') || '';
        this.rut = usuario.rut || '';
        this.correo = usuario.email || '';
        this.telefono = usuario.telefono || '';
      }
    }
  }

  // Método que se llama en el template
  onInputChange() {
    // Puedes agregar lógica de validación aquí si es necesario
  }

  async enviarSolicitud() {
    if (!this.tipoSolicitante || !this.detalleSolicitud || !this.direccionSolicitante) {
      this.error = 'Por favor complete todos los campos requeridos';
      const toast = await this.toastCtrl.create({
        message: this.error,
        duration: 3000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    this.loading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Enviando solicitud...'
    });
    await loading.present();

    const solicitudData = {
      tipo_solicitante: this.tipoSolicitante,
      nombre_solicitante: `${this.nombre} ${this.apellido}`.trim(),
      telefono_solicitante: this.telefono,
      correo_solicitante: this.correo,
      rut_solicitante: this.rut,
      direccion_solicitante: this.direccionSolicitante,
      detalle_solicitud: this.detalleSolicitud,
      estado_solicitud: 'pendiente',
      id_ciudadano: this.getCiudadanoId()
    };

    try {
      // Aquí llamarías a tu API para enviar la solicitud
      // Por ahora solo simulamos el éxito
      await loading.dismiss();
      this.loading = false;
      
      const toast = await this.toastCtrl.create({
        message: 'Solicitud enviada correctamente',
        duration: 3000,
        color: 'success'
      });
      toast.present();

      this.limpiarFormulario();
      
    } catch (error: any) {
      await loading.dismiss();
      this.loading = false;
      this.error = 'Error al enviar la solicitud';
      
      const toast = await this.toastCtrl.create({
        message: this.error,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }

  getCiudadanoId(): number | null {
    const usuario = this.apiService.getCurrentUser();
    return usuario?.id || null;
  }

  limpiarFormulario() {
    this.tipoSolicitante = '';
    this.detalleSolicitud = '';
    this.direccionSolicitante = '';
    this.error = '';
  }

  // Método para el menú (si es necesario)
  openMenu() {
    // Implementa la lógica del menú aquí
    console.log('Abrir menú');
  }
}