import { Persona } from "./comuna.interface";
import { Comuna } from "./comuna.interface";

export interface ConsejoComunal {
  id: string;
  parroquiaRelation: {
    id: number;
    nombre: string;
    municipio: string;
    estado: string;
  };
  cc: string;
  rif: string;
  situr: string | null;
  numeroCuenta: string;
  fechaConstitucion: Date;
  fechaVencimiento: Date;
  poblacionVotante: number;
  comuna: Comuna;

  parroquiaId: number; // <- Agregado
  comunaId: string; 

  titularesComisionElectoral: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
  }[];
  suplentesComisionElectoral: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
  }[];
  titularesContraloria: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
  }[];
  suplentesContraloria: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
  }[];
  titularesFinanzas: Persona[];
  suplentesFinanzas: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
  }[];

  vocerias: {
    id: string;
    tipoVoceria: {
      id: number;
      nombre: string;
    };
    titular: {
      id: number;
      nombre: string;
      apellido: string;
      cedula: string;
    };
    suplente: {
      id: number;
      nombre: string;
      apellido: string;
      cedula: string;
    };
  }[];
  proyectos: any[];
  vehiculos: any[]; 
}

export interface ConsejoComunalFormData {
  cc: string;
  rif: string;
  situr: string;
  numeroCuenta: string;
  fechaConstitucion: string;
  fechaVencimiento: string;
  poblacionVotante: number;
  parroquiaId?: number;
  comunaId?: string;
  titularesComisionElectoralIds: number[];
  suplentesComisionElectoralIds: number[];
  titularesContraloriaIds: number[];
  suplentesContraloriaIds: number[];
  titularesFinanzasIds: number[];
  suplentesFinanzasIds: number[];
  voceriasEjecutivas?: {
    tipoVoceriaId: number;
    titularId?: number;
    suplenteId?: number;
  }[];
}