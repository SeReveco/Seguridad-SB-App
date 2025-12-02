import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-trabajador',
  templateUrl: 'trabajador.page.html',
  styleUrls: ['trabajador.page.scss'],
  standalone: false,
})
export class TrabajadorPage implements OnInit {
  nombreUsuario: string = '';
  rolAsignado: string = '';

  // Datos para los selects
  tiposVehiculos: any[] = [];
  tipoVehiculoSeleccionado: any = null;
  vehiculosFiltrados: any[] = [];
  vehiculoSeleccionado: any = null;
  radiosDisponibles: any[] = [];
  radioSeleccionada: any = null;

  // Código manual
  codigoVehiculoManual: string = '';

  // Estados de carga
  isLoading: boolean = false;
  hasError: boolean = false;

  // Estado del turno
  tieneTurnoActivo: boolean = false;
  detalleTurnoActivo: any = null;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.cargarDatosTrabajador();
  }

  async cargarDatosTrabajador() {
    this.isLoading = true;
    this.hasError = false;

    try {
      const currentUser = this.apiService.getCurrentUser();
      console.log('✅ Usuario actual:', currentUser);

      if (currentUser && currentUser.id) {
        this.nombreUsuario = currentUser.nombre || 'Trabajador';
        this.rolAsignado = currentUser.nombre_rol || 'Sin rol asignado';

        // Verificar si es trabajador (solo trabajadores pueden iniciar turnos)
        if (!this.apiService.isTrabajador()) {
          this.presentToast('Solo trabajadores pueden iniciar turnos');
          this.router.navigate(['/home']);
          return;
        }

        // Primero verificar si ya tiene turno activo
        await this.verificarTurnoActivo(currentUser.id);
        
        // Si no tiene turno activo, cargar datos para iniciar uno nuevo
        if (!this.tieneTurnoActivo) {
          await this.cargarDatosDesdeAPI(currentUser.id);
        }
      } else {
        this.presentToast('Usuario no autenticado');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.hasError = true;
      this.cargarDatosPorDefecto();
    } finally {
      this.isLoading = false;
    }
  }

  async verificarTurnoActivo(usuarioId: number) {
    try {
      console.log('🔍 Verificando turno activo para usuario ID:', usuarioId);

      const response: any = await (this.apiService as any).http.get(
        `${this.apiService['apiUrl']}/api/trabajador/verificar-turno-activo/${usuarioId}/`
      ).toPromise();
      
      this.tieneTurnoActivo = response.tiene_turno_activo;
      this.detalleTurnoActivo = response.detalles;
      
      console.log('📊 Estado del turno:', {
        tieneTurnoActivo: this.tieneTurnoActivo,
        detalle: this.detalleTurnoActivo
      });

      if (this.tieneTurnoActivo) {
        this.presentToast('Ya tienes un turno activo hoy. No puedes iniciar otro turno.');
      }
    } catch (error) {
      console.warn('⚠️ Error verificando turno activo:', error);
      this.tieneTurnoActivo = false;
    }
  }

  async cargarDatosDesdeAPI(usuarioId: number) {
    try {
      console.log('🔍 Cargando datos para usuario ID:', usuarioId);

      const url = `${this.apiService['apiUrl']}/api/trabajador/datos/${usuarioId}/`;
      console.log('🌐 URL de la API:', url);

      const data: any = await (this.apiService as any).http.get(url).toPromise();
      this.procesarDatosAPI(data);
    } catch (apiError: any) {
      console.warn('⚠️ No se pudo conectar a la API con ID:', apiError);
      await this.cargarDatosBasicosAPI();
    }
  }

  async cargarDatosBasicosAPI() {
    try {
      console.log('🔍 Cargando datos básicos desde API...');

      const url = `${this.apiService['apiUrl']}/api/trabajador/datos/`;
      console.log('🌐 URL de la API:', url);

      const data: any = await (this.apiService as any).http.get(url).toPromise();
      this.procesarDatosAPI(data);
    } catch (error: any) {
      console.warn('⚠️ No se pudieron cargar datos básicos:', error);
      this.cargarDatosPorDefecto();
    }
  }

  procesarDatosAPI(data: any) {
    console.log('🔍 DATOS COMPLETOS DE LA API:', data);

    // Asegurarse de que los datos vienen en el formato correcto
    if (data.usuario) {
      this.nombreUsuario = data.usuario.nombre || 'Trabajador';
      this.rolAsignado = data.usuario.rol || 'Sin rol asignado';
    }

    // Cargar tipos de vehículos desde la API
    this.tiposVehiculos = data.tipos_vehiculos || [];
    
    // Cargar radios disponibles
    this.radiosDisponibles = data.radios_disponibles || [];

    console.log('✅ Datos procesados:', {
      tiposVehiculosCount: this.tiposVehiculos.length,
      tiposVehiculosData: this.tiposVehiculos,
      radiosCount: this.radiosDisponibles.length,
      radiosData: this.radiosDisponibles,
      usuario: this.nombreUsuario,
      rol: this.rolAsignado,
    });

    if (this.tiposVehiculos.length === 0) {
      console.warn('⚠️ No se recibieron tipos de vehículos desde la API');
      this.cargarTiposVehiculosPorDefecto();
    }

    if (data.mensaje) {
      console.log('ℹ️ ' + data.mensaje);
      this.presentToast(data.mensaje);
    }
  }

  cargarTiposVehiculosPorDefecto() {
    console.log('📋 Cargando tipos de vehículos por defecto...');

    this.tiposVehiculos = [
      { id_tipo_vehiculo: 1, nombre_tipo_vehiculo: 'Automóvil' },
      { id_tipo_vehiculo: 2, nombre_tipo_vehiculo: 'Motocicleta' },
      { id_tipo_vehiculo: 3, nombre_tipo_vehiculo: 'Camioneta' },
      { id_tipo_vehiculo: 4, nombre_tipo_vehiculo: 'Bicicleta' },
    ];
  }

  cargarDatosPorDefecto() {
    console.log('📋 Cargando todos los datos por defecto...');
    this.cargarTiposVehiculosPorDefecto();

    this.radiosDisponibles = [
      {
        id_radio: 1,
        nombre_radio: 'Radio 61',
        codigo_radio: 'SC7',
        estado_radio: 'Disponible',
      },
      {
        id_radio: 2,
        nombre_radio: 'Radio 63',
        codigo_radio: 'SC4',
        estado_radio: 'Disponible',
      }
    ];

    this.presentToast('Usando datos de demostración - Verifique conexión con el servidor');
  }

  selectTipoVehiculo(tipo: any) {
    console.log('🚗 Tipo de vehículo seleccionado (botón):', tipo);
    this.tipoVehiculoSeleccionado = tipo;
    this.onTipoVehiculoChange();
  }

  onTipoVehiculoChange() {
    console.log('🚗 Tipo de vehículo seleccionado:', this.tipoVehiculoSeleccionado);

    if (this.tipoVehiculoSeleccionado) {
      this.cargarVehiculosPorTipo(this.tipoVehiculoSeleccionado.id_tipo_vehiculo);
      this.vehiculoSeleccionado = null;
      this.codigoVehiculoManual = '';
    } else {
      this.vehiculosFiltrados = [];
      this.vehiculoSeleccionado = null;
    }
  }

  async cargarVehiculosPorTipo(tipoVehiculoId: number) {
    try {
      console.log('🔍 Cargando vehículos para tipo:', tipoVehiculoId);

      const url = `${this.apiService['apiUrl']}/api/trabajador/vehiculos/tipo/${tipoVehiculoId}/`;
      console.log('🌐 URL de vehículos:', url);

      const data: any = await (this.apiService as any).http.get(url).toPromise();

      this.vehiculosFiltrados = data.vehiculos || [];
      console.log('✅ Vehículos cargados:', this.vehiculosFiltrados);

      if (this.vehiculosFiltrados.length === 0) {
        this.vehiculosFiltrados = [
          {
            id_vehiculo: null,
            patente_vehiculo: 'MANUAL',
            marca_vehiculo: 'Manual',
            modelo_vehiculo: 'Ingrese código manualmente',
            codigo_vehiculo: 'MANUAL',
            es_manual: true
          },
        ];
        this.presentToast('No hay vehículos disponibles, use código manual');
      }
    } catch (error) {
      console.warn('⚠️ No se pudieron cargar vehículos, usando modo manual:', error);
      this.vehiculosFiltrados = [
        {
          id_vehiculo: null,
          patente_vehiculo: 'MANUAL',
          marca_vehiculo: 'Manual',
          modelo_vehiculo: 'Ingrese código manualmente',
          codigo_vehiculo: 'MANUAL',
          es_manual: true
        },
      ];
      this.presentToast('Error al cargar vehículos, use código manual');
    }
  }

  onVehiculoChange() {
    console.log('🚙 Vehículo seleccionado:', this.vehiculoSeleccionado);

    if (this.vehiculoSeleccionado && this.vehiculoSeleccionado.es_manual) {
      this.codigoVehiculoManual = '';
    } else if (this.vehiculoSeleccionado) {
      this.codigoVehiculoManual = this.vehiculoSeleccionado.codigo_vehiculo || '';
    }
  }

  onCodigoManualChange() {
    console.log('📝 Código manual cambiado:', this.codigoVehiculoManual);

    if (this.codigoVehiculoManual) {
      this.vehiculoSeleccionado = null;
    }
  }

  // MÉTODO AGREGADO: onRadioChange()
  onRadioChange() {
    console.log('📻 Radio seleccionada:', this.radioSeleccionada);
    
    // Puedes agregar lógica adicional aquí si es necesario
    // Por ejemplo, validar que la radio esté disponible
    if (this.radioSeleccionada && this.radioSeleccionada.estado_radio !== 'Disponible') {
      this.presentToast(`La radio ${this.radioSeleccionada.nombre_radio} no está disponible`);
      this.radioSeleccionada = null;
    }
  }

  async startTrabajo() {
    // Verificar si ya tiene turno activo
    if (this.tieneTurnoActivo) {
      this.presentToast('Ya tienes un turno activo. No puedes iniciar otro.');
      return;
    }

    // Verificar que sea trabajador
    if (!this.apiService.isTrabajador()) {
      this.presentToast('Solo trabajadores pueden iniciar turnos');
      return;
    }

    // Verificar que sea inspector o supervisor
    const user = this.apiService.getCurrentUser();
    if (user && user.id_rol !== 3 && user.id_rol !== 4) {
      this.presentToast('Solo inspectores y supervisores pueden iniciar turnos');
      return;
    }

    if (!this.isReadyToStart()) {
      this.presentToast('Complete todos los campos requeridos');
      return;
    }

    let loading: HTMLIonLoadingElement | null = null;

    try {
      const currentUser = this.apiService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        this.presentToast('Usuario no autenticado');
        this.router.navigate(['/login']);
        return;
      }

      // Mostrar loading
      loading = await this.loadingCtrl.create({
        message: 'Iniciando turno...',
        spinner: 'crescent',
        backdropDismiss: false,
      });
      await loading.present();

      const turnoData = {
        usuario_id: currentUser.id,
        tipo_vehiculo_id: this.tipoVehiculoSeleccionado?.id_tipo_vehiculo,
        vehiculo_id: this.vehiculoSeleccionado?.id_vehiculo,
        codigo_vehiculo_manual: this.codigoVehiculoManual || null,
        radio_id: this.radioSeleccionada?.id_radio,
      };

      console.log('🚀 Enviando datos del turno:', turnoData);

      const url = `${this.apiService['apiUrl']}/api/trabajador/turno/iniciar/`;
      const response: any = await (this.apiService as any).http.post(url, turnoData, {
        headers: { 'Content-Type': 'application/json' },
      }).toPromise();

      console.log('✅ Respuesta del servidor:', response);

      if (loading) {
        await loading.dismiss();
        loading = null;
      }

      if (response.success) {
        this.presentToast(response.message || 'Turno iniciado correctamente');
        this.guardarDatosLocalStorage(response);

        // Actualizar estado del turno
        this.tieneTurnoActivo = true;
        this.detalleTurnoActivo = response;

        // Navegar al home después de iniciar turno
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      } else {
        this.presentToast(response.error || 'Error al iniciar turno');
      }
    } catch (error: any) {
      if (loading) {
        await loading.dismiss();
        loading = null;
      }

      console.error('❌ Error del servidor:', error);
      
      let errorMessage = 'Error al iniciar turno';
      
      // Manejo de errores específicos
      if (error.error) {
        if (error.error.error) {
          errorMessage = error.error.error;
        } else if (error.error.detail) {
          errorMessage = error.error.detail;
        }
      }
      
      this.presentToast(errorMessage);

      // Mostrar más detalles en consola
      console.log('📋 Detalles del error:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error,
      });
    }
  }

  guardarDatosLocalStorage(response: any) {
    const datosTurno = {
      fecha: new Date().toISOString(),
      usuario: this.nombreUsuario,
      rol: this.rolAsignado,
      tipo_vehiculo: this.tipoVehiculoSeleccionado?.nombre_tipo_vehiculo,
      vehiculo: this.vehiculoSeleccionado
        ? `${this.vehiculoSeleccionado.marca_vehiculo} ${this.vehiculoSeleccionado.modelo_vehiculo} - ${this.vehiculoSeleccionado.patente_vehiculo}`
        : `Manual: ${this.codigoVehiculoManual}`,
      radio: this.radioSeleccionada
        ? `${this.radioSeleccionada.nombre_radio} - ${this.radioSeleccionada.codigo_radio}`
        : 'No asignada',
      turno_id: response.turno_id,
      asignacion_vehiculo_id: response.asignacion_vehiculo_id,
      asignacion_radio_id: response.asignacion_radio_id,
      hora_inicio: response.hora_inicio,
      hora_finalizacion_automatica: response.hora_finalizacion_automatica,
    };

    localStorage.setItem('turno_actual', JSON.stringify(datosTurno));
    console.log('💾 Turno guardado en localStorage:', datosTurno);
  }

  isReadyToStart(): boolean {
    // Si ya tiene turno activo, no puede iniciar otro
    if (this.tieneTurnoActivo) {
      return false;
    }

    const errores: string[] = [];

    if (!this.rolAsignado || this.rolAsignado === 'Sin rol asignado') {
      errores.push('Rol no asignado');
    }

    if (!this.tipoVehiculoSeleccionado) {
      errores.push('Tipo de vehículo no seleccionado');
    }

    if (!this.radioSeleccionada) {
      errores.push('Radio no seleccionada');
    }

    if (!this.vehiculoSeleccionado && !this.codigoVehiculoManual) {
      errores.push('Vehículo no seleccionado');
    }

    if (errores.length > 0) {
      console.log('❌ Validaciones fallidas:', errores);
      return false;
    }

    return true;
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  ionViewWillEnter() {
    // Verificar autenticación usando ApiService
    if (!this.apiService.isAuthenticated()) {
      this.presentToast('No tienes permisos para acceder a esta sección');
      this.router.navigate(['/login']);
      return;
    }

    // Verificar que sea trabajador
    if (!this.apiService.isTrabajador()) {
      this.presentToast('Solo trabajadores pueden acceder a esta sección');
      this.router.navigate(['/home']);
      return;
    }

    // Verificar rol específico (inspector o supervisor)
    const user = this.apiService.getCurrentUser();
    if (user && user.id_rol !== 3 && user.id_rol !== 4) {
      this.presentToast('Solo inspectores y supervisores pueden iniciar turnos');
      this.router.navigate(['/home']);
    }
  }

  // Método para limpiar selección de tipo de vehículo
  limpiarTipoVehiculo() {
    this.tipoVehiculoSeleccionado = null;
    this.vehiculosFiltrados = [];
    this.vehiculoSeleccionado = null;
    this.codigoVehiculoManual = '';
  }

  // Método para limpiar selección de radio
  limpiarRadio() {
    this.radioSeleccionada = null;
  }
}