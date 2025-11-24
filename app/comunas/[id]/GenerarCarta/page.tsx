"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import useComunas from "@/hooks/useComunas";
import useGenerarCartaFundacional from "@/hooks/useGenerarCartaFundacional";
// Importar los componentes de estilo
import Tittle from "@/components/Tittle";
import FormInput from "@/components/FormInput"; // Asumimos que esta es la ruta correcta
import Button from "@/components/Button";

export default function GenerarCarta() {
  const { id } = useParams();
  const { data: comunas, isLoading } = useComunas();
  const { generarCarta } = useGenerarCartaFundacional();

  const [fechaReferendo, setFechaReferendo] = useState("");
  const [honor, setHonor] = useState("");
  // Nuevos campos para el Análisis Estratégico
  const [debilidades, setDebilidades] = useState("");
  const [oportunidades, setOportunidades] = useState("");
  const [historia, setHistoria] = useState("");

  if (isLoading) return <Tittle title="Cargando datos de la Comuna..." />;

  const comuna = comunas?.find((c) => c.id === id);
  if (!comuna) return <Tittle title={`No se encontró la comuna con ID ${id}`} />;

  const handleGenerate = () => {
    generarCarta(comuna, {
      fechaReferendo,
      honor,
      debilidades,
      oportunidades,
      historia,
    });
  };

  // La función handleChange genérica funciona para ambos input y textarea,
  // ya que tu interfaz FormInputProps soporta ambos eventos.

  return (
    // Contenedor con el mismo estilo de la página de edición
    <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title={`Generar Carta Fundacional: ${comuna.nombre}`} />

      <form onSubmit={(e) => e.preventDefault()} className="pt-6 px-6 space-y-8">
        
        {/* Sección: Datos Fundacionales */}
        <div>
            <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Datos Fundacionales de la Carta</h3>
            <div className="grid grid-cols-3 gap-4">
                <FormInput
                    id="fechaReferendo"
                    type="date"
                    label="Fecha de Referendo Aprobatorio"
                    value={fechaReferendo}
                    onChange={(e) => setFechaReferendo(e.target.value)}
                    required
                />
                <FormInput
                    id="honor"
                    textarea={true}
                    label="En honor a..."
                    value={honor}
                    onChange={(e) => setHonor(e.target.value)}
                    required
                />
                <FormInput
                    id="historia"
                    textarea={true}
                    label="Historia"
                    value={historia}
                    onChange={(e) => setHistoria(e.target.value)}
                    placeholder="Breve historia de los C.C y los hechos más resaltantes que conyevaron a la conformación de la Comuna"
                    required
                />
            </div>
        </div>

        {/* Sección: Análisis Estratégico (usando FormInput como TextArea) */}
        <div>
            <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Análisis Estratégico (D/O)</h3>
            
            {/* Usamos grid-cols-2 para que los textareas sean más anchos */}
            <div className="grid grid-cols-3 gap-4">
                
                {/* Debilidades */}
                <div className="col-span-1">
                    <FormInput 
                        id="debilidades" 
                        label="Debilidades" 
                        value={debilidades} 
                        onChange={(e) => setDebilidades(e.target.value)} 
                        required 
                        textarea={true} // ⬅️ Correcto: Usando la prop 'textarea'
                        placeholder="Describa las debilidades de la Comuna..."
                    />
                </div>
                
                {/* Oportunidades */}
                <div className="col-span-1">
                    <FormInput 
                        id="oportunidades" 
                        label="Oportunidades" 
                        value={oportunidades} 
                        onChange={(e) => setOportunidades(e.target.value)} 
                        required 
                        textarea={true} // ⬅️ Correcto: Usando la prop 'textarea'
                        placeholder="Describa las oportunidades de la Comuna..."
                    />
                </div>
            </div>
        </div>
        
        <div className="flex justify-center pt-6">
            <Button
                onClick={handleGenerate}
                title="Generar Carta Fundacional (.docx)"
            />
        </div>
      </form>
    </div>
  );
}
