import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  showMenu = false;

  // Rutas donde queremos mostrar el menú
  private menuRoutes = ['/home', '/solicitud', '/perfil', '/alerta'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const path = event.urlAfterRedirects.split('?')[0].split('#')[0];
      // Mostrar menú si la ruta empieza con alguna de las permitidas
      this.showMenu = this.menuRoutes.some(r => path === r || path.startsWith(r + '/'));
    });
  }
}
