"use client";
import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Select, { SingleValue } from 'react-select';
import Tittle from '@/components/Tittle';
import Button from '@/components/Button';
import useConsejos from '@/hooks/useConsejos';
import usePersonas from '@/hooks/usePersonas';
import { useUpdateConsejoVoceros } from '@/hooks/useUpdateConsejoVoceros';
import { useTiposVoceria } from '@/hooks/useTiposVoceria';
import AddVoceriaModal from '@/components/AddVoceriaModal'; 
import toast from 'react-hot-toast';

type OptionType = { value: number; label: string };

interface VoceriaEjecutivaState {
    tipoVoceriaId: number;
    titularId?: number | null; 
    suplenteId?: number | null;
}

const EditVoceriasEjecutivasPage = () => {
    const router = useRouter();
    const { id: consejoId } = useParams() as { id: string };

    const { data: consejosExistentes = [], isLoading: isLoadingConsejos } = useConsejos();
    const consejoAEditar = useMemo(() => {
        return consejosExistentes.find(c => c.id === consejoId);
    }, [consejosExistentes, consejoId]);
    
    const isLoadingCC = isLoadingConsejos && !consejoAEditar;

    const { data: allVoceros = [], isLoading: isLoadingVoceros } = usePersonas();
    const { data: tiposVoceria = [], isLoading: isLoadingTipos } = useTiposVoceria();
    const { mutate, isPending } = useUpdateConsejoVoceros();
    const [modalVoceriaOpen, setModalVoceriaOpen] = useState(false);
    const ocupadosGlobalmente: Set<number> = useMemo(() => {
        const occupiedIds = new Set<number>();
        
        if (consejosExistentes.length === 0) return occupiedIds;

        for (const consejo of consejosExistentes) {
            
            // Vocerías Principales (relaciones M-N)
            const principales = [
                consejo.titularesComisionElectoral,
                consejo.suplentesComisionElectoral,
                consejo.titularesContraloria,
                consejo.suplentesContraloria,
                consejo.titularesFinanzas,
                consejo.suplentesFinanzas,
            ].flat();

            principales.forEach(p => occupiedIds.add(Number(p.id)));

            // Vocerías Ejecutivas (Voceria[])
            if (consejo.vocerias) {
                for (const voceria of consejo.vocerias) {
                    if (voceria.titularId) {
                        occupiedIds.add(voceria.titularId);
                    }
                    if (voceria.suplenteId) {
                        occupiedIds.add(voceria.suplenteId);
                    }
                }
            }
        }
        
        return occupiedIds;
    }, [consejosExistentes]);


    // Mapeo de valores iniciales (Vocerías Ejecutivas)
    const initialVocerias: VoceriaEjecutivaState[] = useMemo(() => {
        if (!consejoAEditar) return [];
        return consejoAEditar.vocerias.map(v => ({
            tipoVoceriaId: v.tipoVoceria.id,
            titularId: v.titular?.id ?? null, 
            suplenteId: v.suplente?.id ?? null,
        }));
    }, [consejoAEditar]);

    const [voceriasEjecutivas, setVoceriasEjecutivas] = useState<VoceriaEjecutivaState[]>(initialVocerias); 
    
    // ... (useEffect para sincronizar y manejar errores sin cambios)
    React.useEffect(() => {
        if (initialVocerias.length > 0 && voceriasEjecutivas.length === 0) {
            setVoceriasEjecutivas(initialVocerias);
        }
    }, [initialVocerias, voceriasEjecutivas]);

    React.useEffect(() => {
        if (!isLoadingCC && !consejoAEditar && consejoId) {
             toast.error("Consejo Comunal no encontrado.");
             router.push('/consejos-comunales'); 
        }
    }, [isLoadingCC, consejoAEditar, consejoId, router]);


    // Filtrar voceros disponibles globalmente (solo los que NO tienen cargo en ningún CC)
    const vocerosDisponiblesGlobales: OptionType[] = allVoceros
        .filter(v => !ocupadosGlobalmente.has(v.id))
        .map(v => ({
            value: v.id,
            label: `${v.nombres} ${v.apellidos} (C.I. ${v.ci})`,
        }));

    const allVoceroOptions: OptionType[] = allVoceros.map(v => ({
        value: v.id,
        label: `${v.nombres} ${v.apellidos} (C.I. ${v.ci})`,
    }));

    const selectedTipoIds = voceriasEjecutivas.map(v => v.tipoVoceriaId);
    
    const voceriasObligatorias = tiposVoceria.filter(v => v.esObligatoria);
    const voceriasOpcionalesDisponibles = tiposVoceria.filter(
        v => !v.esObligatoria && !selectedTipoIds.includes(v.id)
    );
    const voceriasOpcionalesSeleccionadasIds = voceriasEjecutivas.map(v => v.tipoVoceriaId);

    if (isLoadingCC || isLoadingVoceros || isLoadingTipos || !consejoAEditar) {
        return <div>Cargando vocerías ejecutivas...</div>;
    }

    const getUsedVoceroIds = (): number[] => {
        return voceriasEjecutivas.flatMap(v => [v.titularId, v.suplenteId]).filter((id): id is number => id !== null && id !== undefined);
    };
    
    const updateVoceria = (tipoId: number, role: "titularId" | "suplenteId", value?: number | null) => {
        setVoceriasEjecutivas(prev => {
            const index = prev.findIndex(v => v.tipoVoceriaId === tipoId);
            if (index !== -1) {
                const updated = [...prev];
                // Aseguramos que sea null si el select se limpia
                updated[index] = { ...updated[index], [role]: value === undefined ? null : value }; 
                return updated;
            }
            return prev;
        });
    };
    
    const agregarVoceriaOpcional = (tipoIds: number[]) => {
        setVoceriasEjecutivas(prev => {
            const newVocerias: VoceriaEjecutivaState[] = tipoIds
                .filter(id => !prev.some(v => v.tipoVoceriaId === id))
                .map(id => ({ 
                    tipoVoceriaId: id, 
                    titularId: null, // Usamos null para consistencia con el backend
                    suplenteId: null 
                }));
            return [...prev, ...newVocerias];
        });
        setModalVoceriaOpen(false);
    };

    const removeVoceria = (tipoId: number) => {
        setVoceriasEjecutivas(prev => prev.filter(v => v.tipoVoceriaId !== tipoId));
    };
    
    const getAvailableOptions = (currentId?: number | null) => {
        const usedIdsInThisForm = new Set(getUsedVoceroIds());
        
        // 1. Quitar el ID actual para que el select pueda ver su propia selección
        if (currentId && currentId !== null) {
            usedIdsInThisForm.delete(currentId);
        }

        // 2. Filtrar voceros disponibles globalmente para obtener la base de opciones
        let finalOptions = vocerosDisponiblesGlobales.filter(
            opt => !usedIdsInThisForm.has(opt.value)
        );
        
        // 3. Añadir el vocero actual de vuelta si existe (para que el select lo muestre)
        if (currentId && currentId !== null) {
            const currentOption = allVoceroOptions.find(opt => opt.value === currentId);
            
            // Si el vocero actual existe y no fue agregado ya (por estar globalmente disponible)
            if (currentOption && !finalOptions.some(opt => opt.value === currentId)) {
                 // Insertar al inicio para que el Select lo pueda encontrar
                finalOptions = [currentOption, ...finalOptions]; 
            }
        }
        
        return finalOptions;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const missingTitular = voceriasEjecutivas
            .filter(v => voceriasObligatorias.some(ob => ob.id === v.tipoVoceriaId))
            .some(v => v.titularId === null); // Chequear explícitamente si es null

        if (missingTitular) {
            toast.error("Todas las Vocerías Obligatorias deben tener un Titular asignado.");
            return;
        }

        mutate({
            consejoId,
            voceriasEjecutivas: voceriasEjecutivas.map(v => ({
                ...v,
                // Asegurar que el ID del suplente y titular sea number o null (ya lo es en el estado)
                titularId: v.titularId || null, 
                suplenteId: v.suplenteId || null,
            })),
        });
    };


    // --- Renderizado ---
    const voceriasToRender = tiposVoceria
        .filter(tipo => selectedTipoIds.includes(tipo.id))
        .map(tipo => ({
            ...tipo,
            data: voceriasEjecutivas.find(v => v.tipoVoceriaId === tipo.id)!,
        }));

    return (
        <div className="animate-fade-in mx-auto my-1 max-w-[95%] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
            <Tittle title={`Editar Vocerías Ejecutivas de: ${consejoAEditar.cc}`} />

            <form onSubmit={handleSubmit} className="pt-6 px-6 space-y-8">
                
                <div className="flex justify-end">
                    <Button type="button" onClick={() => setModalVoceriaOpen(true)} title="➕ Agregar Vocería Opcional" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {voceriasToRender.map(voceria => (
                        <div key={voceria.id} className="col-span-1 border p-4 rounded-md bg-white shadow-sm relative">
                            <p className="font-medium text-lg text-sky-800 flex justify-between items-center">
                                {voceria.nombre} 
                                {voceria.esObligatoria ? <span className="text-red-600 text-xs">(Obligatoria)</span> : (
                                    <Button 
                                        type="button" 
                                        title="X" 
                                        onClick={() => removeVoceria(voceria.id)} 
                                        className="bg-red-500 hover:bg-red-700 text-white p-1 rounded-full text-xs"
                                    />
                                )}
                            </p>
                            
                            {/* Titular */}
                            <label className="text-sm text-gray-700 block mt-3 mb-1">Titular {voceria.esObligatoria && <span className="text-red-600">*</span>}</label>
                            <Select
                                placeholder="Seleccionar Titular"
                                options={getAvailableOptions(voceria.data.titularId)}
                                value={allVoceroOptions.find(option => option.value === voceria.data.titularId) || null} // Usamos allVoceroOptions
                                onChange={selected => updateVoceria(voceria.id, "titularId", (selected as SingleValue<OptionType>)?.value ?? null)}
                                isClearable
                            />
                            
                            {/* Suplente */}
                            <label className="text-sm text-gray-700 block mt-3 mb-1">Suplente</label>
                            <Select
                                placeholder="Seleccionar Suplente"
                                options={getAvailableOptions(voceria.data.suplenteId)}
                                value={allVoceroOptions.find(option => option.value === voceria.data.suplenteId) || null} // Usamos allVoceroOptions
                                onChange={selected => updateVoceria(voceria.id, "suplenteId", (selected as SingleValue<OptionType>)?.value ?? null)}
                                isClearable
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center pt-6">
                    <Button 
                        title={isPending ? "Guardando..." : "Guardar Cambios de Vocerías Ejecutivas"}
                        type="submit"
                        disabled={isPending}
                    />
                </div>
            </form>

            <AddVoceriaModal
                open={modalVoceriaOpen}
                onClose={() => setModalVoceriaOpen(false)}
                onAddVoceria={agregarVoceriaOpcional}
                voceriasOpcionales={voceriasOpcionalesDisponibles} 
                voceriasOpcionalesSeleccionadas={voceriasOpcionalesSeleccionadasIds} 
            />
        </div>
    );
};

export default EditVoceriasEjecutivasPage;