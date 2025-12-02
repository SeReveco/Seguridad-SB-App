import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  showMenu = false;
  esTrabajador = false;

  // Rutas donde queremos mostrar el menú
  private menuRoutes = [
    '/home', 
    '/solicitud', 
    '/perfil', 
    '/alerta',
    '/historial-denuncias',
    '/historial-solicitudes',
    '/historial-fiscalizaciones'
  ];

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const path = event.urlAfterRedirects.split('?')[0].split('#')[0];
      // Mostrar menú si la ruta empieza con alguna de las permitidas
      this.showMenu = this.menuRoutes.some(r => path === r || path.startsWith(r + '/'));
    });

    // Verificar si el usuario es trabajador
    this.verificarRolUsuario();
  }

  private verificarRolUsuario() {
    // Aquí va la lógica para verificar si el usuario es trabajador
    // Puedes obtener esta información de:
    // 1. localStorage/sessionStorage
    // 2. Un servicio de autenticación
    // 3. La respuesta del login
    
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Asumiendo que el rol viene como 'trabajador' o similar
        this.esTrabajador = user.rol === 'trabajador' || 
                           user.rol === 'inspector' || 
                           user.rol === 'fiscalizador' ||
                           user.tipo_usuario === 'trabajador';
        
        console.log('Usuario es trabajador:', this.esTrabajador);
      } catch (error) {
        console.error('Error al parsear userData:', error);
        this.esTrabajador = false;
      }
    } else {
      // Si no hay datos, asumimos que no es trabajador
      this.esTrabajador = false;
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.performLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  private performLogout() {
    // Limpiar localStorage/sessionStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();

    // Resetear variables
    this.esTrabajador = false;

    // Redirigir al login
    this.router.navigate(['/login']);
    
    // Ocultar el menú
    this.showMenu = false;

    console.log('Sesión cerrada exitosamente');
  }
}