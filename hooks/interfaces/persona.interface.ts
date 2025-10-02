import type { ConsejoComunal } from "./consejo.comunal.interface";
import type { Vehiculo } from "./vehiculo.interface";

export interface Persona {
    id: number;
    nombres: string;
    apellidos: string;
    ci: string;
    telefono:string;
    consejoTitularFinanzas?: any| null;     
    vehiculo?: Vehiculo | null;    
  }

  export interface PersonaFormData {
    id?: number;
    nombres: string;
    apellidos: string;
    ci?: string;
    telefono: string;
  }
  