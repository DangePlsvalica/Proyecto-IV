import type { ConsejoComunal } from "./consejo.comunal.interface";
import type { Vehiculo } from "./vehiculo.interface";

export interface Persona {
    id: number;
    nombres: string;
    apellidos: string;
    ci: string;
    telefono:string;
    cc?: ConsejoComunal | null;     // Relación: vocero del consejo comunal
    vehiculo?: Vehiculo | null;     // Relación: vehículo asignado
  }

  export interface PersonaFormData {
    id?: number;
    nombres: string;
    apellidos: string;
    ci?: string;
    telefono: string;
  }
  