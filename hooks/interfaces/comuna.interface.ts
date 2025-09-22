export interface Persona {
  id: string;
  nombres: string;
  apellidos: string;
  ci: string;
  telefono: string;
}

export interface Comuna {
  id: string;
  codigo: string;
  numComisionPromotora: string;
  fechaComisionPromotora: Date;
  rif: string;
  cuentaBancaria: string;
  fechaRegistro: Date;
  nombre: string;
  direccion: string;
  linderoNorte: string;
  linderoSur: string;
  linderoEste: string;
  linderoOeste: string;
  consejosComunales: any;
  fechaUltimaEleccion: Date;
  parroquiaRelation: any;
  cantidadConsejosComunales: number;
  poblacionVotante: number;
  bancoDeLaComuna: Persona[];
  // ADDED: New interfaces for the new governing bodies
  titularesComisionElectoral?: Persona[];
  suplentesComisionElectoral?: Persona[];
  titularesContraloria?: Persona[];
  suplentesContraloria?: Persona[];
  parlamentoComuna?: Persona[];
  consejoJusticiaPaz?: Persona[];
}

export interface ComunaFormData {
  id?: string;
  codigo: string;
  numComisionPromotora: string;
  fechaComisionPromotora: string;
  rif: string;
  cuentaBancaria: string;
  fechaRegistro: string;
  nombre: string;
  direccion: string;
  linderoNorte: string;
  linderoSur: string;
  linderoEste: string;
  linderoOeste: string;
  consejosComunales: string[];
  fechaUltimaEleccion: string;
  parroquiaId: number;
  cantidadConsejosComunales: number;
  poblacionVotante: number;
  bancoDeLaComuna?: string[]; // Nuevo: array de IDs para la creación
}
  