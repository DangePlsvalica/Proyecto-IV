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
  consejoComunal: string; 
  fechaUltimaEleccion: Date;
  municipio: string;
  parroquia: string;
  nombreVocero: string;
  ciVocero: string;
  telefono: string;
  cantidadConsejosComunales: number;
  poblacionVotante: number;
}
  