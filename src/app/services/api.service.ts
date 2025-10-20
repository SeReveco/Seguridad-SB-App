import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario, LoginResponse } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // ========== AUTHENTICATION ==========

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/api/ionic/login/`,
        { email, password },
        { headers: this.getHeaders() }
      )
      .pipe(
        tap((response) => {
          if (response.success && response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Agrega este método en la sección AUTHENTICATION del ApiService
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/register/`, userData, {
      headers: this.getHeaders(),
    });
  }

  // ========== DASHBOARD ==========

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/ionic/dashboard/stats/`);
  }

  // ========== USUARIOS ==========

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/usuarios/`);
  }

  getUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/usuarios/${id}/`);
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/usuarios/`, usuario, {
      headers: this.getHeaders(),
    });
  }

  updateUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/usuarios/${id}/`, usuario, {
      headers: this.getHeaders(),
    });
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/usuarios/${id}/`);
  }

  buscarUsuarios(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get(`${this.apiUrl}/api/usuarios/buscar/`, { params });
  }

  // ========== VEHÍCULOS ==========

  getVehiculos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/ionic/vehiculos/`);
  }

  createVehiculo(vehiculo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/ionic/vehiculos/`, vehiculo, {
      headers: this.getHeaders(),
    });
  }

  getTiposVehiculos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/ionic/tipos-vehiculos/`);
  }

  // ========== DENUNCIAS ==========

  getDenuncias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/ionic/denuncias/`);
  }

  createDenuncia(denuncia: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/ionic/denuncias/`, denuncia, {
      headers: this.getHeaders(),
    });
  }

  // ========== REQUERIMIENTOS ==========

  getRequerimientos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/requerimientos/`);
  }

  getRequerimiento(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/requerimientos/${id}/`);
  }

  createRequerimiento(requerimiento: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/requerimientos/`, requerimiento, {
      headers: this.getHeaders(),
    });
  }

  updateRequerimiento(id: number, requerimiento: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/requerimientos/${id}/`,
      requerimiento,
      { headers: this.getHeaders() }
    );
  }

  deleteRequerimiento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/requerimientos/${id}/`);
  }

  getRutaRequerimiento(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/requerimientos/${id}/ruta/`);
  }

  // ========== CATALOGOS ==========

  getFamilias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/familias/`);
  }

  createFamilia(familia: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/familias/`, familia, {
      headers: this.getHeaders(),
    });
  }

  deleteFamilia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/familias/${id}/`);
  }

  getGrupos(familiaId?: number): Observable<any> {
    let params = new HttpParams();
    if (familiaId) {
      params = params.set('familia_id', familiaId.toString());
    }
    return this.http.get(`${this.apiUrl}/api/grupos/`, { params });
  }

  createGrupo(grupo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/grupos/`, grupo, {
      headers: this.getHeaders(),
    });
  }

  deleteGrupo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/grupos/${id}/`);
  }

  getSubgrupos(grupoId?: number): Observable<any> {
    let params = new HttpParams();
    if (grupoId) {
      params = params.set('grupo_id', grupoId.toString());
    }
    return this.http.get(`${this.apiUrl}/api/subgrupos/`, { params });
  }

  createSubgrupo(subgrupo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/subgrupos/`, subgrupo, {
      headers: this.getHeaders(),
    });
  }

  deleteSubgrupo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/subgrupos/${id}/`);
  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/ionic/roles/`);
  }

  getTurnos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/ionic/turnos/`);
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

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.es_administrador || false;
  }

  isOperador(): boolean {
    const user = this.getCurrentUser();
    return user?.es_operador || false;
  }

  getNombreCompleto(): string {
    const user = this.getCurrentUser();
    if (user) {
      return `${user.nombre_usuario} ${user.apellido_pat_usuario} ${user.apellido_mat_usuario}`.trim();
    }
    return '';
  }
}
