export interface Vehiculo {
  id_vehiculo?: number;
  patente_vehiculo: string;
  marca_vehiculo: string;
  modelo_vehiculo: string;
  codigo_vehiculo: string;
  id_tipo_vehiculo: number;
  nombre_tipo_vehiculo?: string;
  estado_vehiculo: string;
  fecha_creacion?: string;
}

export interface Denuncia {
  id_denuncia?: number;
  hora_denuncia: string;
  fecha_denuncia: string;
  id_solicitante: number;
  nombre_solicitante?: string;
  direccion: string;
  id_requerimiento: number;
  nombre_requerimiento?: string;
  detalle_denuncia: string;
  visibilidad_camaras_denuncia: boolean;
  id_turno: number;
  labor_realizada_denuncia?: string;
  estado_denuncia: string;
  fecha_creacion?: string;
}