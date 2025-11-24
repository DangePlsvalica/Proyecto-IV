import type { ConsejoComunal } from "./consejo.comunal.interface";
import type { Vehiculo } from "./vehiculo.interface";


export interface ConsejoComunalBase {
    id: string; 
    cc: string; 
    nombre: string;
}

export interface VoceriaBase {
    id: number;
    nombre: string;
}

export interface Persona {
    id: number;
    nombres: string;
    apellidos: string;
    ci: string;
    telefono: string;
    vehiculo?: Vehiculo | null; 
    habilitado: boolean;
    voceriaTitular?: VoceriaBase | null;
    voceriaSuplente?: VoceriaBase | null;
    bancoDeLaComunaRelation?: any | null;
    comunaId?: string | null;
    consejoTitularComisionElectoral: ConsejoComunalBase[];
    consejoSuplenteComisionElectoral: ConsejoComunalBase[];
    consejoTitularContraloria: ConsejoComunalBase[];
    consejoSuplenteContraloria: ConsejoComunalBase[];
    consejoTitularFinanzas: ConsejoComunalBase[]; 
    consejoSuplenteFinanzas: ConsejoComunalBase[];
}

  export interface PersonaFormData {
    id?: number;
    nombres: string;
    apellidos: string;
    ci?: string;
    telefono: string;
  }
  