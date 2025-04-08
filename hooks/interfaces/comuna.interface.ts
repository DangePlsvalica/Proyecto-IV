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
  consejoComunal: any; 
  fechaUltimaEleccion: Date;
  municipio: string;
  parroquia: string;
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
  consejoComunal: Array<{ value: string; label: string }>;
  fechaUltimaEleccion: string;
  municipio: string;
  parroquia: string;
  nombreVocero: string;
  ciVocero: string;
  telefono: string;
  cantidadConsejosComunales: number;
  poblacionVotante: number;
}
  