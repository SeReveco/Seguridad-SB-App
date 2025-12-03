import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  user_type: 'ciudadano' | 'trabajador';
  nombre: string;
  email: string;
  rut: string;
  id_rol: number;
  nombre_rol: string;
  telefono?: string;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    this.initStorage();
  }

  private initStorage() {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // ========== AUTHENTICATION DUAL ==========

  // 🔐 LOGIN DUAL - Detecta automáticamente el tipo de usuario
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/ionic/login/`,
        { email, password },
        { headers: this.getHeaders() }
      )
      .pipe(
        tap((response: any) => {
          if (response.success) {
            // Guardar datos del usuario en localStorage
            localStorage.setItem('user_data', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);

            // Guardar datos adicionales para compatibilidad
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('nombreUsuario', response.user.nombre);
            localStorage.setItem('email', response.user.email);
            localStorage.setItem('userRole', response.user.nombre_rol);
            localStorage.setItem('userId', response.user.id.toString());
          }
        })
      );
  }

  // 📝 REGISTRO SOLO PARA CIUDADANOS
  registerCiudadano(ciudadanoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ionic/register/`, ciudadanoData, {
      headers: this.getHeaders(),
    });
  }

  // 🚪 LOGOUT
  logout(): void {
    localStorage.removeItem('user_data');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    this.currentUserSubject.next(null);
  }

  // 👤 GET CURRENT USER
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // ✅ CHECK AUTH
  isAuthenticated(): boolean {
    const user = localStorage.getItem('user_data');
    return !!user;
  }

  // 🔍 CHECK USER TYPE
  isCiudadano(): boolean {
    const user = this.getCurrentUser();
    return user?.user_type === 'ciudadano';
  }

  isTrabajador(): boolean {
    const user = this.getCurrentUser();
    return user?.user_type === 'trabajador';
  }

  getTipoUsuario(): 'ciudadano' | 'trabajador' | null {
    const user = this.getCurrentUser();
    return user ? user.user_type : null;
  }

  // 🎯 CHECK ROLES Y ACCESOS
  canAccessApp(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    if (user.user_type === 'ciudadano') {
      return true; // Todos los ciudadanos pueden acceder
    }

    if (user.user_type === 'trabajador') {
      // Solo inspectores (4) y supervisores (3) pueden acceder a la app móvil
      return user.id_rol === 3 || user.id_rol === 4;
    }

    return false;
  }

  // 🔧 ROL SPECIFIC CHECKS
  isInspector(): boolean {
    const user = this.getCurrentUser();
    return user?.user_type === 'trabajador' && user.id_rol === 4;
  }

  isSupervisor(): boolean {
    const user = this.getCurrentUser();
    return user?.user_type === 'trabajador' && user.id_rol === 3;
  }

  // 📊 Para mostrar información del usuario
  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    return user?.nombre || 'Usuario';
  }

  getUserRoleName(): string {
    const user = this.getCurrentUser();
    return user?.nombre_rol || 'Sin rol';
  }

  // ========== DASHBOARD ==========
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ionic/dashboard/stats/`);
  }

  // ========== USUARIOS ==========
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/`);
  }

  getUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}/`);
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/`, usuario, {
      headers: this.getHeaders(),
    });
  }

  updateUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}/`, usuario, {
      headers: this.getHeaders(),
    });
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}/`);
  }

  buscarUsuarios(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get(`${this.apiUrl}/usuarios/buscar/`, { params });
  }

  // ========== VEHÍCULOS ==========
  getVehiculos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ionic/vehiculos/`);
  }

  createVehiculo(vehiculo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ionic/vehiculos/`, vehiculo, {
      headers: this.getHeaders(),
    });
  }

  getTiposVehiculos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ionic/tipos-vehiculos/`);
  }

  // ========== DENUNCIAS ==========
  getDenuncias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ionic/denuncias/`);
  }

  createDenuncia(denuncia: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ionic/denuncias/`, denuncia, {
      headers: this.getHeaders(),
    });
  }

  // ========== REQUERIMIENTOS ==========
  getRequerimientos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/requerimientos/`);
  }

  getRequerimiento(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/requerimientos/${id}/`);
  }

  createRequerimiento(requerimiento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/requerimientos/`, requerimiento, {
      headers: this.getHeaders(),
    });
  }

  updateRequerimiento(id: number, requerimiento: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/requerimientos/${id}/`,
      requerimiento,
      { headers: this.getHeaders() }
    );
  }

  deleteRequerimiento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/requerimientos/${id}/`);
  }

  getRutaRequerimiento(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/requerimientos/${id}/ruta/`);
  }

  // ========== CATALOGOS ==========
  getFamilias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/familias/`);
  }

  createFamilia(familia: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/familias/`, familia, {
      headers: this.getHeaders(),
    });
  }

  deleteFamilia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/familias/${id}/`);
  }

  getGrupos(familiaId?: number): Observable<any> {
    let params = new HttpParams();
    if (familiaId) {
      params = params.set('familia_id', familiaId.toString());
    }
    return this.http.get(`${this.apiUrl}/grupos/`, { params });
  }

  createGrupo(grupo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/grupos/`, grupo, {
      headers: this.getHeaders(),
    });
  }

  deleteGrupo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grupos/${id}/`);
  }

  getSubgrupos(grupoId?: number): Observable<any> {
    let params = new HttpParams();
    if (grupoId) {
      params = params.set('grupo_id', grupoId.toString());
    }
    return this.http.get(`${this.apiUrl}/subgrupos/`, { params });
  }

  createSubgrupo(subgrupo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/subgrupos/`, subgrupo, {
      headers: this.getHeaders(),
    });
  }

  deleteSubgrupo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/subgrupos/${id}/`);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ionic/roles/`);
  }

  getTurnos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ionic/turnos/`);
  }

  // ========== UTILIDAD ==========
  handleError(error: any): string {
    if (error.error && error.error.error) {
      return error.error.error;
    } else if (error.message) {
      return error.message;
    } else {
      return 'Error desconocido en la aplicación';
    }
  }

  // CORREGIDO: Usamos id_rol en lugar de propiedades booleanas
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.user_type === 'trabajador' && user.id_rol === 1;
  }

  isOperador(): boolean {
    const user = this.getCurrentUser();
    return user?.user_type === 'trabajador' && user.id_rol === 2;
  }

  // 🔐 Verificar si el usuario actual puede acceder (no es operador)
  canAccess(): boolean {
    const user = this.getCurrentUser();
    return user?.user_type === 'trabajador' && user.id_rol !== 2;
  }

  getNombreCompleto(): string {
    const user = this.getCurrentUser();
    if (user) {
      return user.nombre;
    }
    return '';
  }

  iniciarTurnoTrabajador(turnoData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/trabajador/turno/iniciar/`,
      turnoData,
      { headers: this.getHeaders() }
    );
  }

  // Método para verificar turno activo
  verificarTurnoActivo(usuarioId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/trabajador/verificar-turno-activo/${usuarioId}/`
    );
  }

  // Método para obtener datos del trabajador
  obtenerDatosTrabajador(usuarioId?: number): Observable<any> {
    if (usuarioId) {
      return this.http.get(`${this.apiUrl}/api/trabajador/datos/${usuarioId}/`);
    }
    return this.http.get(`${this.apiUrl}/api/trabajador/datos/`);
  }

  // Método para obtener vehículos por tipo
  obtenerVehiculosPorTipo(tipoVehiculoId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/trabajador/vehiculos/tipo/${tipoVehiculoId}/`
    );
  }
}
