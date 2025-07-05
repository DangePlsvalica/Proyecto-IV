import type { Persona } from "./persona.interface";

export interface ConsejoComunal {
  id: string;
  cc: string;
  rif: string;
  numeroCuenta: string;
  fechaConstitucion: Date;
  fechaVencimiento: Date;
  vocero?: Persona | null;
  poblacionVotante: number;
  parroquiaRelation?: {
    nombre: string;
    municipio: string;
    estado: string;     
  };
  comuna?: {
    nombre: string;
  };
}

export interface ConsejoComunalFormData {
  cc: string;
  rif: string;
  numeroCuenta: string;
  fechaConstitucion: string | Date;
  fechaVencimiento: string | Date;
  poblacionVotante: number;
  parroquiaId?: number;
  voceroId?: number;
  comunaId?: string;
}
  