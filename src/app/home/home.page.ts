import { Component, AfterViewInit, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit, OnInit {

  mostrarFormulario: boolean = false;
  map: any;
  denuncias: any[] = [];

  tipoUsuario: 'ciudadano' | 'trabajador' | null = null;

  // Campos del formulario
  solicitante: string = '';
  telefono: string = '';
  direccion: string = '';
  ubicacion: string = '';
  tipo: string = '';
  descripcion: string = '';

  constructor(
    private menuController: MenuController, 
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.tipoUsuario = this.api.getTipoUsuario();
  }

  async openMenu() {
    await this.menuController.open();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {

    /* ===========================
       1. Crear el mapa en Santiago
       =========================== */
    this.map = L.map('map', {
      zoomControl: true,
      minZoom: 12,
      maxZoom: 18,
    }).setView([-33.45, -70.65], 13);

    /* ===========================
       2. Capas
       =========================== */
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    setTimeout(() => this.map.invalidateSize(), 300);

    /* ===========================
       3. Limitar desplazamiento (Bounds Santiago)
       =========================== */
    const bounds = L.latLngBounds(
      L.latLng(-33.10, -70.95), // NORTE - OESTE
      L.latLng(-33.90, -70.45)  // SUR - ESTE
    );

    this.map.setMaxBounds(bounds);

    // Evitar que el usuario arrastre el mapa fuera de Santiago
    this.map.on('drag', () => {
      this.map.panInsideBounds(bounds, { animate: false });
    });

    /* ===========================
       4. Click en el mapa
       =========================== */
    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));

    /* Ajustes en cambios de tamaño */
    window.addEventListener('resize', () => this.map.invalidateSize());
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    const marker = L.marker(e.latlng).addTo(this.map);

    marker
      .bindPopup(
        `Ubicación seleccionada:<br>Lat: ${e.latlng.lat.toFixed(
          6
        )}<br>Lng: ${e.latlng.lng.toFixed(6)}`
      )
      .openPopup();

    this.ubicacion = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
  }

  goToUbicacionActual() {
    if (this.map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          this.map.setView([lat, lng], 17, { animate: true });

          const iconUbicacion = L.divIcon({
            html: '<div style="background-color: #3880ff; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
            className: 'ubicacion-actual-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          // Agregar marcador
          L.marker([lat, lng], { icon: iconUbicacion })
            .addTo(this.map)
            .bindPopup('Tu ubicación actual')
            .openPopup();

          this.ubicacion = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        },
        () => alert('No se pudo obtener la ubicación actual.'),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  }

  abrirFormulario() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.ubicacion = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          this.mostrarFormulario = true;
        },
        () => {
          const center = this.map.getCenter();
          this.ubicacion = `${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}`;
          this.mostrarFormulario = true;
        }
      );
    }
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.solicitante = '';
    this.telefono = '';
    this.direccion = '';
    this.ubicacion = '';
    this.tipo = '';
    this.descripcion = '';
  }

  async enviarDenuncia() {

    // Validaciones
    if (!this.tipo?.trim()) {
      alert('Por favor, especifica el tipo de denuncia.');
      return;
    }

    if (!this.descripcion?.trim()) {
      alert('Por favor, describe la situación.');
      return;
    }

    if (!this.ubicacion?.trim()) {
      alert('No se pudo obtener la ubicación.');
      return;
    }

    try {
      const solicitanteFinal = this.solicitante.trim()
        ? this.solicitante
        : 'Anónimo';

      const ahora = new Date();
      const fecha = ahora.toLocaleDateString('es-CL');
      const hora = ahora.toLocaleTimeString('es-CL');

      const nuevaDenuncia = {
        solicitante: solicitanteFinal,
        telefono: this.telefono || 'No especificado',
        direccion: this.direccion || 'No especificada',
        ubicacion: this.ubicacion,
        tipo: this.tipo,
        descripcion: this.descripcion,
        fecha,
        hora,
        coordenadas: this.ubicacion
          .split(',')
          .map((coord) => parseFloat(coord.trim())),
      };

      this.denuncias.push(nuevaDenuncia);

      this.agregarMarcadorDenuncia(nuevaDenuncia);

      alert('¡Denuncia enviada exitosamente!');
      this.cerrarFormulario();
    } catch (error) {
      console.error('Error al enviar denuncia:', error);
      alert('Hubo un error. Intenta nuevamente.');
    }
  }

  private agregarMarcadorDenuncia(denuncia: any): void {
    const [lat, lng] = denuncia.coordenadas;

    const iconDenuncia = L.divIcon({
      html: '<div style="background-color: #ff3b30; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
      className: 'alerta-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const marker = L.marker([lat, lng], { icon: iconDenuncia }).addTo(this.map);

    const popupContent = `
      <div style="min-width: 200px;">
        <strong>${denuncia.tipo}</strong><br>
        <small>${denuncia.descripcion}</small><br>
        <hr>
        <small><strong>Solicitante:</strong> ${denuncia.solicitante}</small><br>
        <small><strong>Fecha:</strong> ${denuncia.fecha} ${denuncia.hora}</small><br>
        <small><strong>Ubicación:</strong> ${denuncia.ubicacion}</small>
      </div>
    `;

    marker.bindPopup(popupContent);
  }

  // ===== NAVEGACIÓN =====
  goToDenuncias() {
    this.router.navigate(['/denuncias']);
  }

  goToSolicitud() {
    this.router.navigate(['/solicitud']);
  }
}
