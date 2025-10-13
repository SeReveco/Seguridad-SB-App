export interface Requerimiento {
  id_requerimiento?: number;
  nombre_requerimiento: string;
  codigo_requerimiento: string;
  id_subgrupo_denuncia: number;
  clasificacion_requerimiento: string;
  descripcion_requerimiento: string;
  familia_nombre?: string;
  grupo_nombre?: string;
  subgrupo_nombre?: string;
}

export interface Familia {
  id_familia_denuncia?: number;
  nombre_familia_denuncia: string;
  codigo_familia: string;
}

export interface Grupo {
  id_grupo_denuncia?: number;
  nombre_grupo_denuncia: string;
  codigo_grupo: string;
  id_familia_denuncia: number;
}

export interface Subgrupo {
  id_subgrupo_denuncia?: number;
  nombre_subgrupo_denuncia: string;
  codigo_subgrupo: string;
  id_grupo_denuncia: number;
}