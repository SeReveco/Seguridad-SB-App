import { Component, AfterViewInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit {
  mostrarFormulario: boolean = false;
  map: any;
  alertas: any[] = [];

  // Campos del formulario
  solicitante: string = '';
  telefono: string = '';
  direccion: string = '';
  ubicacion: string = '';
  tipo: string = '';
  descripcion: string = '';

  constructor(private menuController: MenuController, private router: Router) {}

  async openMenu() {
    await this.menuController.open();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-33.592, -70.7], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // 👇 IMPORTANTE: ajustar el tamaño después de que Angular pinte todo
    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onMapClick(e);
    });

    // Opcional: si gira la pantalla o cambia tamaño
    window.addEventListener('resize', () => {
      this.map.invalidateSize();
    });
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    // Puedes agregar un marcador al hacer click en el mapa
    const marker = L.marker(e.latlng).addTo(this.map);
    marker
      .bindPopup(
        `Ubicación seleccionada:<br>Lat: ${e.latlng.lat.toFixed(
          6
        )}<br>Lng: ${e.latlng.lng.toFixed(6)}`
      )
      .openPopup();

    // Actualizar la ubicación en el formulario si está abierto
    this.ubicacion = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
  }

  goToUbicacionActual() {
    if (this.map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Centrar mapa en la ubicación actual
          this.map.setView([lat, lng], 17, { animate: true });

          // Crear icono personalizado para ubicación actual
          const iconUbicacion = L.divIcon({
            html: '<div style="background-color: #3880ff; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
            className: 'ubicacion-actual-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          // Limpiar marcadores anteriores de ubicación
          this.map.eachLayer((layer: any) => {
            if (
              layer instanceof L.Marker &&
              layer.options.icon === iconUbicacion
            ) {
              this.map.removeLayer(layer);
            }
          });

          // Agregar nuevo marcador
          L.marker([lat, lng], { icon: iconUbicacion })
            .addTo(this.map)
            .bindPopup('Tu ubicación actual')
            .openPopup();

          // Actualizar ubicación en formulario
          this.ubicacion = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          alert(
            'No se pudo obtener la ubicación actual. Asegúrate de tener el GPS activado.'
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      alert('Geolocalización no soportada en este navegador.');
    }
  }

  abrirFormulario() {
    // Intentar obtener ubicación actual al abrir el formulario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.ubicacion = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          this.mostrarFormulario = true;
        },
        (error) => {
          // Si no se puede obtener ubicación, usar centro del mapa
          const center = this.map.getCenter();
          this.ubicacion = `${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}`;
          this.mostrarFormulario = true;
        }
      );
    } else {
      // Fallback: usar centro del mapa
      const center = this.map.getCenter();
      this.ubicacion = `${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}`;
      this.mostrarFormulario = true;
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

  async enviarAlerta() {
    // Validaciones
    if (!this.tipo?.trim()) {
      alert('Por favor, especifica el tipo de alerta.');
      return;
    }

    if (!this.descripcion?.trim()) {
      alert('Por favor, describe la situación.');
      return;
    }

    if (!this.ubicacion?.trim()) {
      alert('No se pudo obtener la ubicación. Intenta nuevamente.');
      return;
    }

    try {
      const solicitanteFinal = this.solicitante.trim()
        ? this.solicitante
        : 'Anónimo';
      const ahora = new Date();
      const fecha = ahora.toLocaleDateString('es-CL');
      const hora = ahora.toLocaleTimeString('es-CL');

      // Crear nueva alerta
      const nuevaAlerta = {
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

      // Agregar a la lista de alertas
      this.alertas.push(nuevaAlerta);

      // Agregar marcador en el mapa
      this.agregarMarcadorAlerta(nuevaAlerta);

      // Mostrar confirmación
      alert('¡Alerta reportada exitosamente! Se ha agregado al mapa.');

      // Cerrar formulario
      this.cerrarFormulario();
    } catch (error) {
      console.error('Error al enviar alerta:', error);
      alert('Error al enviar la alerta. Intenta nuevamente.');
    }
  }

  private agregarMarcadorAlerta(alerta: any): void {
    const [lat, lng] = alerta.coordenadas;

    // Crear icono personalizado para alertas
    const iconAlerta = L.divIcon({
      html: '<div style="background-color: #ff3b30; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
      className: 'alerta-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    // Agregar marcador al mapa
    const marker = L.marker([lat, lng], { icon: iconAlerta }).addTo(this.map);

    // Crear contenido del popup
    const popupContent = `
      <div style="min-width: 200px;">
        <strong>${alerta.tipo}</strong><br>
        <small>${alerta.descripcion}</small><br>
        <hr style="margin: 8px 0;">
        <small><strong>Solicitante:</strong> ${alerta.solicitante}</small><br>
        <small><strong>Fecha:</strong> ${alerta.fecha} ${alerta.hora}</small><br>
        <small><strong>Ubicación:</strong> ${alerta.ubicacion}</small>
      </div>
    `;

    marker.bindPopup(popupContent);
  }

  // Navegación
  goToAlerta() {
    this.router.navigate(['/alerta']);
  }

  goToSolicitud() {
    this.router.navigate(['/solicitud']);
  }
}
