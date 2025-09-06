import type { Persona } from "./persona.interface";

export interface ConsejoComunal {
  id: string;
  cc: string;
  rif: string;
  numeroCuenta: string;
  fechaConstitucion: string;
  fechaVencimiento: string;
  poblacionVotante: number;

  parroquiaRelation?: { nombre: string; municipio: string; estado: string };
  comuna?: { nombre: string };

  // Vocerías dinámicas
  vocerias?: VoceriaEjecutivaPayload[];

  // Vocerías fijas (principales)
  comisionElectoral?: Persona;
  suplenteComisionElectoral?: Persona;
  contraloria?: Persona;
  suplenteContraloria?: Persona;
  finanzas?: Persona;
  suplenteFinanzas?: Persona;
}

export interface VoceriaEjecutivaPayload {
  id: number;
  tipoVoceriaId: number;
  titularId?: number;
  suplenteId?: number;

  tipoVoceria: {
    id: number;
    nombre: string;
    esObligatoria?: boolean;
    categoriaId?: number;
  };

  titular?: {
    id: number;
    nombres: string;
    apellidos: string;
    ci?: string;
    telefono?: string;
  };

  suplente?: {
    id: number;
    nombres: string;
    apellidos: string;
    ci?: string;
    telefono?: string;
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
  comunaId?: string;

  // Vocerías principales (obligatorias)
  comisionElectoralId?: number;
  suplenteComisionElectoralId?: number;
  contraloriaId?: number;
  suplenteContraloriaId?: number;
  finanzasId?: number;
  suplenteFinanzasId?: number;

  // Vocerías ejecutivas (dinámicas)
  voceriasEjecutivas?: {
    tipoVoceriaId: number;
    titularId?: number;
    suplenteId?: number;
  }[];
}