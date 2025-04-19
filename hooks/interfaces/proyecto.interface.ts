export interface Proyecto {
    id?: number;
    nombre: string;
    status: string;
    fechaCreacion: Date;
    ultimaActividad: Date;
    categoria: string;
    comuna: string;
  }

  export interface ProyectoFormData {
    id?: string;
    nombre: string;
    status: string;
    fechaCreacion: string;
    ultimaActividad: string;
    categoria: string;
    comuna: string;
  }
  