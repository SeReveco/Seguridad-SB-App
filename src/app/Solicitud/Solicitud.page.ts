import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
  standalone: false
})
export class SolicitudPage implements OnInit {
  // Campos del formulario
  nombre: string = '';
  apellido: string = '';
  rut: string = '';
  correo: string = '';
  telefono: string = '';
  direccion: string = '';
  descripcion: string = '';
  
  error: string = '';
  loading: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private menuController: MenuController
  ) {}

  async ngOnInit() {
    // Cargar datos del usuario si está logueado
    await this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    try {
      // ✅ CORREGIDO: usar getCurrentUser() en lugar de getUsuario()
      const usuario = this.apiService.getCurrentUser();
      
      if (usuario) {
        // Si el usuario está logueado, pre-llenar los campos
        this.nombre = usuario.nombre_usuario || '';
        this.apellido = `${usuario.apellido_pat_usuario || ''} ${usuario.apellido_mat_usuario || ''}`.trim();
        this.rut = usuario.rut_usuario || '';
        this.correo = usuario.correo_electronico_usuario || '';
        this.telefono = usuario.telefono_movil_usuario || '';
      }
      // Si no está logueado, los campos quedarán vacíos para que el usuario los complete
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }

  async enviarSolicitud() {
    // Validar formulario
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      // Preparar datos para la denuncia
      const denunciaData = {
        hora_denuncia: new Date().toISOString(),
        fecha_denuncia: new Date().toISOString().split('T')[0],
        id_solicitante: this.obtenerIdSolicitante(),
        direccion: this.direccion || 'Dirección no especificada',
        id_requerimiento: 1, // ID por defecto o según tu lógica
        detalle_denuncia: this.descripcion,
        visibilidad_camaras_denuncia: false,
        id_turno: 1, // Turno por defecto
        labor_realizada_denuncia: 'Solicitud recibida',
        estado_denuncia: 'Recibido'
      };

      const response: any = await this.apiService.createDenuncia(denunciaData).toPromise();
      
      if (response.success) {
        console.log('Solicitud enviada exitosamente:', response);
        this.mostrarMensajeExito();
        this.limpiarFormulario();
      } else {
        this.error = response.error || 'Error al enviar la solicitud';
      }
    } catch (error: any) {
      console.error('Error enviando solicitud:', error);
      this.error = this.apiService.handleError(error) || 'Error de conexión';
    } finally {
      this.loading = false;
    }
  }

  private obtenerIdSolicitante(): number | null {
    const usuario = this.apiService.getCurrentUser();
    return usuario?.id_usuario || null;
  }

  validarFormulario(): boolean {
    // Validaciones básicas
    if (!this.nombre?.trim()) {
      this.error = 'El nombre es requerido';
      return false;
    }

    if (!this.apellido?.trim()) {
      this.error = 'El apellido es requerido';
      return false;
    }

    if (!this.rut?.trim()) {
      this.error = 'El RUT es requerido';
      return false;
    }

    if (!this.validarRUT(this.rut)) {
      this.error = 'El RUT no tiene un formato válido';
      return false;
    }

    if (!this.correo?.trim()) {
      this.error = 'El correo electrónico es requerido';
      return false;
    }

    if (!this.validarEmail(this.correo)) {
      this.error = 'El correo electrónico no es válido';
      return false;
    }

    if (!this.telefono?.trim()) {
      this.error = 'El teléfono es requerido';
      return false;
    }

    if (!this.descripcion?.trim()) {
      this.error = 'La descripción es requerida';
      return false;
    }

    if (this.descripcion.length < 10) {
      this.error = 'La descripción debe tener al menos 10 caracteres';
      return false;
    }

    return true;
  }

  validarRUT(rut: string): boolean {
    // Validación básica de RUT chileno
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    return rutLimpio.length >= 8 && rutLimpio.length <= 9;
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  mostrarMensajeExito() {
    // Puedes usar un toast, alert o modal
    alert('¡Solicitud enviada exitosamente! Nos pondremos en contacto contigo pronto.');
    
    // Opcional: redirigir al home después de éxito
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
  }

  limpiarFormulario() {
    this.nombre = '';
    this.apellido = '';
    this.rut = '';
    this.correo = '';
    this.telefono = '';
    this.direccion = '';
    this.descripcion = '';
    this.error = '';
  }

  // Método para el menú
  async openMenu() {
    await this.menuController.open();
  }

  // Limpiar error cuando el usuario empiece a escribir
  onInputChange() {
    if (this.error) {
      this.error = '';
    }
  }

  // Navegación
  goToHome() {
    this.router.navigate(['/home']);
  }

  goToMapa() {
    this.router.navigate(['/home']);
  }

  goToAlerta() {
    this.router.navigate(['/alerta']);
  }
}