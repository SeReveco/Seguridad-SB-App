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
  tipoUsuario = '';
  selectedFiles: File[] = [];
  selectedFileNames: string[] = [];
  fileErrors: string[] = [];

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
      this.tipoUsuario = usuario.user_type || '';
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

    // Si es ciudadano debemos tener al menos un archivo (obligatorio)
    const isCiudadano = this.apiService.isCiudadano();

    try {
      if (isCiudadano) {
        // Validar que haya al menos un archivo seleccionado
        if (!this.selectedFiles || this.selectedFiles.length === 0) {
          await loading.dismiss();
          this.loading = false;
          this.error = 'Debe adjuntar al menos un archivo PDF (máx. 5 MB cada uno).';
          const toast = await this.toastCtrl.create({
            message: this.error,
            duration: 3000,
            color: 'warning'
          });
          toast.present();
          return;
        }

        const formData = new FormData();
        formData.append('tipo_solicitante', this.tipoSolicitante);
        formData.append('nombre_solicitante', `${this.nombre} ${this.apellido}`.trim());
        formData.append('telefono_solicitante', this.telefono || '');
        formData.append('correo_solicitante', this.correo || '');
        formData.append('rut_solicitante', this.rut || '');
        formData.append('direccion_solicitante', this.direccionSolicitante || '');
        formData.append('detalle_solicitud', this.detalleSolicitud || '');
        formData.append('estado_solicitud', 'pendiente');
        const idC = this.getCiudadanoId();
        if (idC) formData.append('id_ciudadano', String(idC));
        // Añadir múltiples archivos; el backend debe aceptar múltiples entradas con la misma clave 'archivo'
        this.selectedFiles.forEach((f) => {
          formData.append('archivo', f, f.name);
        });

        this.apiService.createRequerimientoWithFile(formData).subscribe({
          next: async (resp) => {
            await loading.dismiss();
            this.loading = false;
            const toast = await this.toastCtrl.create({
              message: 'Solicitud enviada correctamente',
              duration: 3000,
              color: 'success'
            });
            toast.present();
            this.limpiarFormulario();
            this.removeFile();
          },
          error: async (err) => {
            await loading.dismiss();
            this.loading = false;
            this.error = this.apiService.handleError(err) || 'Error al enviar la solicitud';
            const toast = await this.toastCtrl.create({
              message: this.error,
              duration: 3000,
              color: 'danger'
            });
            toast.present();
          }
        });
      } else {
        // Sin archivo o trabajador: enviamos JSON
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

        this.apiService.createRequerimiento(solicitudData).subscribe({
          next: async (resp) => {
            await loading.dismiss();
            this.loading = false;
            const toast = await this.toastCtrl.create({
              message: 'Solicitud enviada correctamente',
              duration: 3000,
              color: 'success'
            });
            toast.present();
            this.limpiarFormulario();
          },
          error: async (err) => {
            await loading.dismiss();
            this.loading = false;
            this.error = this.apiService.handleError(err) || 'Error al enviar la solicitud';
            const toast = await this.toastCtrl.create({
              message: this.error,
              duration: 3000,
              color: 'danger'
            });
            toast.present();
          }
        });
      }
    } catch (error: any) {
      await loading.dismiss();
      this.loading = false;
      this.error = 'Error al procesar la solicitud';
      const toast = await this.toastCtrl.create({
        message: this.error,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }

  onFileSelected(event: any) {
    this.fileErrors = [];
    const fileList: FileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const maxSize = 5 * 1024 * 1024; // 5 MB
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList.item(i);
      if (!f) continue;
      // Validar tamaño
      if (f.size > maxSize) {
        errors.push(`${f.name}: supera el tamaño máximo`);
        continue;
      }
      // Validar tipo PDF
      const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        errors.push(`${f.name}: no es PDF`);
        continue;
      }
      validFiles.push(f);
    }

    // Guardar errores (si existen)
    this.fileErrors = errors;

    if (validFiles.length === 0) {
      // No hay archivos válidos
      (event.target as HTMLInputElement).value = '';
      return;
    }

    // Agregar archivos válidos (permitir múltiples cargas acumulativas)
    this.selectedFiles = this.selectedFiles.concat(validFiles);
    this.selectedFileNames = this.selectedFiles.map(f => f.name);
    (event.target as HTMLInputElement).value = '';
  }

  removeFile(index?: number) {
    if (typeof index === 'number' && index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
    } else {
      this.selectedFiles = [];
    }
    this.selectedFileNames = this.selectedFiles.map(f => f.name);
    if (this.selectedFiles.length === 0) this.fileErrors = [];
    const inputs = document.querySelectorAll('input[type=file]');
    inputs.forEach((i: any) => (i.value = ''));
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
    // Limpiar archivos seleccionados
    this.selectedFiles = [];
    this.selectedFileNames = [];
    this.fileErrors = [];
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${value} ${sizes[i]}`;
  }

  // Método para el menú (si es necesario)
  openMenu() {
    // Implementa la lógica del menú aquí
    console.log('Abrir menú');
  }
}