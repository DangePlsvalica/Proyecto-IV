export interface Persona {
    id?: number;
    nombres: string;
    apellidos: string;
    juridica: boolean;
    ci: string;
    rif: string;
    telefono:string;
    cc: any; 
  }

  export interface PersonaFormData {
    id?: number;
    nombres: string;
    apellidos: string;
    juridica: boolean;
    ci?: string;
    rif?: string;
    telefono: string;
  }
  