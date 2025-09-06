import { useMutation } from "@tanstack/react-query";

export interface TipoVoceria {
  id?: number;
  nombre: string;
  esObligatoria?: boolean;
  categoriaId: number;
}

export interface TipoVoceriaFormData {
  id?: number;
  nombre: string;
  categoriaId: number;
}

async function registerVoceria(data: TipoVoceriaFormData): Promise<TipoVoceria> {
  const res = await fetch("/api/vocerias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al registrar la vocería");
  }

  return res.json();
}

export function useRegisterVoceria() {
  return useMutation({ mutationFn: registerVoceria });
}
