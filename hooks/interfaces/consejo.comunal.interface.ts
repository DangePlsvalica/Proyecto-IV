import { Persona } from "./comuna.interface";

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
  comunaId: string | null;

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
  titularesFinanzas?: Persona[];
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
  proyectos: any[]; // Define esta interfaz si es necesario
  vehiculos: any[]; // Define esta interfaz si es necesario
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

  // Vocerías principales (cambiadas a arreglos de números)
  titularesComisionElectoralIds: number[];
  suplentesComisionElectoralIds: number[];
  titularesContraloriaIds: number[];
  suplentesContraloriaIds: number[];
  titularesFinanzasIds: number[];
  suplentesFinanzasIds: number[];

  // Vocerías ejecutivas (dinámicas)
  voceriasEjecutivas?: {
    tipoVoceriaId: number;
    titularId?: number;
    suplenteId?: number;
  }[];
}