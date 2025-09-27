export interface Usuario {
  nombre: string;
  apellido: string;
  rut: string;
  correo: string;
  telefono: string;
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Simulación: obtener datos del usuario autenticado
  getUsuario(): Usuario {
    // Aquí deberías obtener los datos reales del usuario autenticado
    return {
      nombre: 'Usuario Ejemplo',
      apellido: 'Apellido Ejemplo',
      rut: '12345678-9',
      correo: 'usuario@ejemplo.com',
      telefono: '123456789'
    };
  }

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
