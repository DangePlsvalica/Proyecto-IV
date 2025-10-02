import { useMutation } from "@tanstack/react-query";
import { post } from '@/lib/request/api';

export interface ConsultaFormData {
  nombre: string;
}

export interface Consulta {
  id: string;
  nombre: string;
}

async function registerConsulta(data: ConsultaFormData): Promise<Consulta> {
  const res = await post<Consulta>({
    path: '/api/consultas',
    body: data,
  });

  return res;
}

export function useRegisterConsulta() {
  return useMutation({ mutationFn: registerConsulta });
}
