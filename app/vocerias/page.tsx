"use client";
import React from "react";
import Divider from "../../components/Divider";
import Loading from "@/components/Loading";
import Tittle from "@/components/Tittle";
import { useTiposVoceria } from "@/hooks/useTiposVoceria";

const nombresCategorias: Record<number, string> = {
  1: "Economía Productiva",
  2: "Ciudades Humanas y Servicios",
  3: "Seguridad y Paz",
  4: "Suprema Felicidad Social",
  5: "Organización y Planificación Popular",
  6: "Ecosocialismo, Ciencia y Tecnología",
};

const colorCategorias: Record<number, string> = {
  1: "bg-[#0B1535]", // Azul oscuro
  2: "bg-[#2765AE]", // Azul medio
  3: "bg-[#2B8CC5]", // Azul claro
  4: "bg-[#7E3EB0]", // Morado
  5: "bg-[#C1498E]", // Rosado fuerte
  6: "bg-[#6B7280]", // Gris
};

const Vocerias: React.FC = () => {
  const { data: voceriasData, isLoading } = useTiposVoceria();

  if (isLoading || !voceriasData) return <Loading />;

  const categorias = Array.from({ length: 6 }, (_, i) => i + 1);

  const voceriasPorCategoria = categorias.map((catId) => ({
    categoriaId: catId,
    vocerias: voceriasData.filter((v) => v.categoriaId === catId),
  }));

  return (
    <>
      <Tittle title="Vocerías" />
      <Divider />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-0 gap-y-6 pl-6 mt-6">
        {voceriasPorCategoria.map(({ categoriaId, vocerias }) => (
          <div
            key={categoriaId}
            className="flex min-h-[300px] max-w-[780px] rounded-lg overflow-hidden shadow-md"
          >
            {/* Columna izquierda: título */}
            <div
              className={`w-1/4 flex items-center justify-center p-4 text-white font-bold text-lg ${colorCategorias[categoriaId]}`}
            >
              <span className="text-center leading-snug">
                {nombresCategorias[categoriaId] ?? `Categoría ${categoriaId}`}
              </span>
            </div>

            {/* Columna derecha: lista */}
            <div className="flex-1 bg-gray-100 p-4 flex items-center">
              <ul className="space-y-2 text-sm text-gray-700">
                {vocerias.map((voceria) => (
                  <li
                    key={voceria.id}
                    className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-white"
                  >
                    {voceria.nombre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Vocerias;
