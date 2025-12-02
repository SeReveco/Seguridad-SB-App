import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.apiService.isAuthenticated();
    
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar acceso a la app según el tipo de usuario y rol
    if (!this.apiService.canAccessApp()) {
      this.router.navigate(['/access-denied']);
      return false;
    }

    return true;
  }
}

// Guard específico para ciudadanos
@Injectable({
  providedIn: 'root'
})
export class CiudadanoGuard implements CanActivate {
  
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.apiService.isAuthenticated();
    
    if (!isAuthenticated || !this.apiService.isCiudadano()) {
      this.router.navigate(['/access-denied']);
      return false;
    }

    return true;
  }
}

// Guard específico para trabajadores de app móvil
@Injectable({
  providedIn: 'root'
})
export class TrabajadorAppGuard implements CanActivate {
  
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.apiService.isAuthenticated();
    
    if (!isAuthenticated || !this.apiService.isTrabajador() || 
        !this.apiService.canAccessApp()) {
      this.router.navigate(['/access-denied']);
      return false;
    }

    return true;
  }
}

// Guard específico para inspectores
@Injectable({
  providedIn: 'root'
})
export class InspectorGuard implements CanActivate {
  
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.apiService.isAuthenticated();
    
    if (!isAuthenticated || !this.apiService.isInspector()) {
      this.router.navigate(['/access-denied']);
      return false;
    }

    return true;
  }
}

// Guard específico para supervisores
@Injectable({
  providedIn: 'root'
})
export class SupervisorGuard implements CanActivate {
  
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.apiService.isAuthenticated();
    
    if (!isAuthenticated || !this.apiService.isSupervisor()) {
      this.router.navigate(['/access-denied']);
      return false;
    }

    return true;
  }
}