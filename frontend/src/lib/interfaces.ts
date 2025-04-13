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
