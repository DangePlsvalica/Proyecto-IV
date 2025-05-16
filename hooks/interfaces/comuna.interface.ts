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
  nombreVocero: string;
  ciVocero: string;
  telefono: string;
  cantidadConsejosComunales: number;
  poblacionVotante: number;
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
  nombreVocero: string;
  ciVocero: string;
  telefono: string;
  cantidadConsejosComunales: number;
  poblacionVotante: number;
}
  