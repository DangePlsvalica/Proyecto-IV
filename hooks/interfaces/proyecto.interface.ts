export interface Proyecto {
  id: string;
  nombreProyecto: string;
  codigoProyecto: string;
  consulta: number;
  estatusProyecto: string;
  circuito: string;
  categoria: string;
  observacion?: string;

  consejoComunalId: string;
  consejoComunal?: {
    id: string;
    cc: string; // Nombre del Consejo Comunal
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
  consulta: number;
  estatusProyecto: string;
  circuito: string;
  categoria: string;
  observacion?: string;
  consejoComunalId: string;
}