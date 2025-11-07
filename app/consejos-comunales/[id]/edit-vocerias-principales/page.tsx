"use client";
import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Select, { MultiValue } from 'react-select';
import Tittle from '@/components/Tittle';
import Button from '@/components/Button';
import useConsejos from '@/hooks/useConsejos';
import usePersonas from '@/hooks/usePersonas';
import { useUpdateConsejoVoceros } from '@/hooks/useUpdateConsejoVoceros';
import { Persona } from '@/hooks/interfaces/persona.interface';
import toast from 'react-hot-toast';

type OptionType = { value: number; label: string };

const EditVoceriasPrincipalesPage = () => {
    const router = useRouter();
    const { id: consejoId } = useParams() as { id: string };
    
    // 1. OBTENER EL CONSEJO Y TODOS LOS CONSEJOS
    const { data: consejosExistentes = [], isLoading: isLoadingConsejos } = useConsejos();
    const consejoAEditar = useMemo(() => {
        return consejosExistentes.find(c => c.id === consejoId);
    }, [consejosExistentes, consejoId]);

    const isLoadingCC = isLoadingConsejos && !consejoAEditar;

    const { data: allVoceros = [], isLoading: isLoadingVoceros } = usePersonas();
    const { mutate, isPending } = useUpdateConsejoVoceros();

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

    // 2. Mapeo de valores iniciales al estado local (SIN CAMBIOS)
    const initialFormData = useMemo(() => {
        if (!consejoAEditar) return null;

        const mapToNumberIds = (personas: { id: number | string }[]) => 
            personas.map(p => Number(p.id));

        return {
            titularesComisionElectoralIds: mapToNumberIds(consejoAEditar.titularesComisionElectoral),
            suplentesComisionElectoralIds: mapToNumberIds(consejoAEditar.suplentesComisionElectoral),
            titularesContraloriaIds: mapToNumberIds(consejoAEditar.titularesContraloria),
            suplentesContraloriaIds: mapToNumberIds(consejoAEditar.suplentesContraloria),
            titularesFinanzasIds: mapToNumberIds(consejoAEditar.titularesFinanzas),
            suplentesFinanzasIds: mapToNumberIds(consejoAEditar.suplentesFinanzas),
        };
    }, [consejoAEditar]);

    const [formData, setFormData] = useState(initialFormData);

    // Sincronizar estado cuando se cargan los datos por primera vez
    React.useEffect(() => {
        if (initialFormData && !formData) {
            setFormData(initialFormData);
        }
    }, [initialFormData, formData]);

    // Manejar el caso de consejo no encontrado
    React.useEffect(() => {
        if (!isLoadingCC && !consejoAEditar && consejoId) {
            toast.error("Consejo Comunal no encontrado.");
            router.push('/consejos-comunales');
        }
    }, [isLoadingCC, consejoAEditar, consejoId, router]);


    if (isLoadingCC || isLoadingVoceros || !consejoAEditar || !formData) {
        return <div>Cargando vocerías principales...</div>;
    }

    // 3. Opciones disponibles: Filtrar voceros que NO están ocupados globalmente
    const voceroOptions: OptionType[] = allVoceros
        .filter((v: Persona) => {
            return !ocupadosGlobalmente.has(v.id);
        })
        .map((v: Persona) => ({
            value: v.id,
            label: `${v.nombres} ${v.apellidos} (C.I. ${v.ci})`,
        }));
    
    // Función para manejar el cambio en los MultiSelect (SIN CAMBIOS)
    const handleMultiSelectChange = (
        field: keyof typeof formData,
        selected: MultiValue<OptionType>
    ) => {
        const ids = selected.map(option => option.value);
        setFormData(prev => ({
            ...prev!,
            [field]: ids,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        mutate({
            consejoId,
            ...formData!,
        });
    };

    const voceriasPrincipalesConfig = [
        { id: "titularesComisionElectoralIds", suplenteId: "suplentesComisionElectoralIds", label: "Comisión Electoral" },
        { id: "titularesContraloriaIds", suplenteId: "suplentesContraloriaIds", label: "Unidad de Contraloría Social" },
        { id: "titularesFinanzasIds", suplenteId: "suplentesFinanzasIds", label: "Unidad Administrativa y Financiera Comunitaria" },
    ];
    
    // 4. Helper para obtener las opciones disponibles para un select (AJUSTADO)
    const getAvailableOptions = (currentIds: number[]) => {
        // Obtener todos los IDs seleccionados en ESTE formulario actualmente
        const selectedIdsInThisForm = new Set(Object.values(formData!).flatMap(arr => arr as number[]));
        
        // Opciones base: los voceros disponibles globalmente (ya filtrados en voceroOptions)
        const availableOptions = voceroOptions.filter(opt => !selectedIdsInThisForm.has(opt.value));

        const currentOptions = currentIds
            .map(id => allVoceros.find(v => v.id === id)) 
            .filter((v): v is Persona => v !== undefined)
            .map(v => ({
                value: v.id,
                label: `${v.nombres} ${v.apellidos} (C.I. ${v.ci})`,
            }));

        // Combinar opciones disponibles y opciones actuales
        return [...availableOptions, ...currentOptions];
    };


    return (
        <div className="animate-fade-in mx-auto my-1 max-w-[95%] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
            <Tittle title={`Editar Vocerías Principales de: ${consejoAEditar.cc}`} />

            <form onSubmit={handleSubmit} className="pt-6 px-6 space-y-8">
                
                {voceriasPrincipalesConfig.map(voceria => {
                    const currentTitulares = formData[voceria.id as keyof typeof formData] as number[];
                    const currentSuplentes = formData[voceria.suplenteId as keyof typeof formData] as number[];

                    return (
                        <div key={voceria.id} className="border p-4 rounded-md bg-white shadow-sm">
                            <p className="text-sky-900 font-bold mb-2">{voceria.label}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-700 block mb-1">Titular (5)</label>
                                    <Select
                                        placeholder="Seleccionar Titulares"
                                        options={getAvailableOptions(currentTitulares)}
                                        onChange={selected =>
                                            handleMultiSelectChange(voceria.id as keyof typeof formData, selected as MultiValue<OptionType>)
                                        }
                                        // Mapear los IDs actuales a objetos OptionType para la propiedad 'value'
                                        value={currentTitulares.map(id => allVoceros.find(v => v.id === id))
                                            .filter((v): v is Persona => v !== undefined)
                                            .map(v => ({ value: v.id, label: `${v.nombres} ${v.apellidos} (C.I. ${v.ci})`}))
                                        }
                                        isMulti
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-700 block mb-1">Suplente (5)</label>
                                    <Select
                                        placeholder="Seleccionar Suplentes"
                                        options={getAvailableOptions(currentSuplentes)}
                                        onChange={selected =>
                                            handleMultiSelectChange(voceria.suplenteId as keyof typeof formData, selected as MultiValue<OptionType>)
                                        }
                                        value={currentSuplentes.map(id => allVoceros.find(v => v.id === id))
                                            .filter((v): v is Persona => v !== undefined)
                                            .map(v => ({ value: v.id, label: `${v.nombres} ${v.apellidos} (C.I. ${v.ci})`}))
                                        }
                                        isMulti
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="flex justify-center pt-6">
                    <Button 
                        title={isPending ? "Guardando..." : "Guardar Cambios de Vocerías Principales"}
                        type="submit"
                        disabled={isPending}
                    />
                </div>
            </form>
        </div>
    );
};

export default EditVoceriasPrincipalesPage;