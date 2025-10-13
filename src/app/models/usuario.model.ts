export interface Usuario {
  id_usuario?: number;
  nombre_usuario: string;
  apellido_pat_usuario: string;
  apellido_mat_usuario: string;
  rut_usuario: string;
  correo_electronico_usuario: string;
  telefono_movil_usuario: string;
  id_rol?: number;
  nombre_rol?: string;
  id_turno?: number;
  nombre_turno?: string;
  es_administrador?: boolean;
  es_operador?: boolean;
  es_conductor?: boolean;
  es_ciudadano?: boolean;
  is_active?: boolean;
  fecha_creacion?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: Usuario;
  message?: string;
  error?: string;
}