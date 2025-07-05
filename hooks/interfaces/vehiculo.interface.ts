import type { Persona } from "./persona.interface";

export interface Vehiculo {
  id: number;
  placa: string;
  clase: string;
  cc: string;
  comuna: string;
  marca: string;
  modelo: string;
  color: string;
  ano: number;
  municipio: string;
  serialCarroceria: string;
  voceroAsignado: string;
  fechaDeEntrega: Date;
  estatus: string;
  observacionArchivo: string;
  observacion: string;
}

export interface VehiculoFormData {
  id?: number;
  placa: string;
  clase: string;
  cc: string;
  comuna: string;
  marca: string;
  modelo: string;
  color: string;
  ano: number;
  municipio: string;
  serialCarroceria: string;
  voceroAsignado?: Persona | null;
  fechaDeEntrega: string;
  estatus: string;
  observacionArchivo: string;
  observacion: string;
}
  