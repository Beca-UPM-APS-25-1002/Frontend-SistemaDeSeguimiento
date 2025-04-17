interface Profesor {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
  is_admin: boolean;
}

interface Ciclo {
  id: number;
  nombre: string;
  año_academico: string;
}

interface Modulo {
  id: number;
  ciclo: Ciclo;
  nombre: string;
  curso: number;
}
export interface UnidadDeTrabajo {
  id: number;
  numero_tema: number;
  titulo: string;
  modulo: number;
}

interface Grupo {
  id: number;
  nombre: string;
  curso: number;
  ciclo: number;
}

export interface Docencia {
  id: number;
  profesor: Profesor;
  modulo: Modulo;
  grupo: Grupo;
}

export interface Seguimiento {
  id: number;
  profesor: Profesor;
  modulo: Modulo;
  grupo: Grupo;
  ultimo_contenido_impartido: string;
  estado: string;
  justificacion_estado: string;
  cumple_programacion: boolean;
  justificacion_cumple_programacion: string;
  mes: number;
  evaluacion: string;
  temario_actual: number;
  docencia: number;
}

export interface SeguimientosFaltantesPorMes {
  [mes: number]: number[];
}

export interface FetchSvelteKit {
  (input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  (
    input: string | URL | globalThis.Request,
    init?: RequestInit
  ): Promise<Response>;
}
