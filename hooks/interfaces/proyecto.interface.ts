export type TipoImpacto = 'ALTO_RENDIMIENTO' | 'NORMAL' | 'BAJO_IMPACTO';

export interface Proyecto {
  id: string;
  nombreProyecto: string;
  codigoProyecto: string;
  estatusProyecto: string;
  observacion?: string;
  familiasBeneficiadas: number; 
  personasBeneficiadas: number; 
  comunidadesBeneficiadas: number; 
  impacto: TipoImpacto | null; 
  consultaId: string;
  categoriaId: string;
  consulta?: {
    id: string;
    nombre: string;
  };
  categoria?: {
    id: string;
    nombre: string;
  };

  consejoComunalId: string;
  consejoComunal?: {
    id: string;
    cc: string; 
    situr?: string;
    parroquiaRelation?: {
      id: number;
      nombre: string;
      municipio: string;
      estado: string;
    };
    comuna?: {
      id: string;
      nombre: string;
      codigo: string;
    };
  };
}

export interface ProyectoFormData {
  nombreProyecto: string;
  codigoProyecto: string;
  estatusProyecto: string;
  observacion?: string;
  familiasBeneficiadas: number; 
  personasBeneficiadas: number; 
  comunidadesBeneficiadas: number; 
  consultaId: string; 
  categoriaId: string;
  consejoComunalId: string;
  impacto?: TipoImpacto; 
}