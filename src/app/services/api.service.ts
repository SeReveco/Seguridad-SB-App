import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Login (JWT)
  login(username: string, password: string) {
    return this.http.post(`${this.baseUrl}/token/`, { username, password });
  }

  // Ejemplo: obtener rutas
  getRutas() {
    return this.http.get(`${this.baseUrl}/rutas/`);
  }

  // Ejemplo: crear alerta
  createAlerta(data: any) {
    return this.http.post(`${this.baseUrl}/alertas/`, data);
  }
}
