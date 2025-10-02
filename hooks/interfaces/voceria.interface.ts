
export type Persona = {
    nombres?: string;
    apellidos?: string;
    ci?: string;
    telefono?: string;
};

export type VoceroDataType = Persona | Persona[] | null | undefined;

export interface TipoVoceriaData {
    id: number | string | null;
    nombre: string;
}

export interface Voceria {
  id: number; 
  ccId: string;
  tipoVoceriaId: number;
  tipoVoceria: TipoVoceriaData;
  titular: VoceroDataType;
  suplente: VoceroDataType; 
}
 