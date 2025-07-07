import type { Persona } from "./persona.interface";
import type { ConsejoComunal } from "./consejo.comunal.interface"; // crea esta interfaz también

export interface Vehiculo {
  id: number;
  placa: string;
  clase: string;
  cc: string;
  marca: string;
  modelo: string;
  color: string;
  ano: number;
  serialCarroceria: string;
  voceroId?: number | null;
  fechaDeEntrega: Date;
  estatus: string;
  observacionArchivo: string;
  observacion: string;
  voceroAsignado?: Persona | null;
  consejoComunal?: ConsejoComunal | null; // relación a ConsejoComunal con comuna y parroquia
}

export interface VehiculoFormData {
  id?: number;
  placa: string;
  clase: string;
  cc: string;
  marca: string;
  modelo: string;
  color: string;
  ano: number;
  serialCarroceria: string;
  voceroId?: number | null;
  fechaDeEntrega: string;
  estatus: string;
  observacionArchivo: string | File;
  observacion: string;
}
  