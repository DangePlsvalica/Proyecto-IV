"use client";
import React, { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Tittle from "@/components/Tittle";
import toast from "react-hot-toast";
import useParroquias from "@/hooks/useParroquias";
import { ConsejoComunalFormDataEdit, ConsejoComunal } from "@/hooks/interfaces/consejo.comunal.interface";
import useConsejos from "@/hooks/useConsejos";
import { useUpdateConsejoComunal } from "@/hooks/useUpdateConsejo"; 

const EditConsejoPage = () => {
    type OptionType = { value: number; label: string };

    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const queryClient = useQueryClient();
    const { data: parroquias = [] } = useParroquias();
    const { data: consejosExistentes = [], isLoading: isLoadingConsejos } = useConsejos();

    const { mutate: updateConsejo, isPending } = useUpdateConsejoComunal(id); 

    const consejoAEditar = consejosExistentes.find(c => c.id === id); 
    const isConsejoLoading = isLoadingConsejos && !consejoAEditar;
    
    useEffect(() => {
        if (!isConsejoLoading && !consejoAEditar && id) {
            toast.error("Consejo Comunal no encontrado.");
            router.push('/consejos-comunales'); 
        }
    }, [isConsejoLoading, consejoAEditar, id, router]);

    const [formData, setFormData] = useState<ConsejoComunalFormDataEdit>({
        cc: "",
        rif: "",
        situr: "",
        numeroCuenta: "",
        fechaConstitucion: "",
        fechaVencimiento: "",
        poblacionVotante: 0,
        parroquiaId: undefined,
        comunaId: undefined,
        titularesComisionElectoralIds: [],
        suplentesComisionElectoralIds: [],
        titularesContraloriaIds: [],
        suplentesContraloriaIds: [],
        titularesFinanzasIds: [],
        suplentesFinanzasIds: [],
    });
    
    const [voceriasEjecutivas, setVoceriasEjecutivas] = useState<
        { tipoVoceriaId: number; titularId?: number; suplenteId?: number }[]
    >([]);
    
    const parroquiaOptions: OptionType[] = parroquias.map(p => ({
        value: p.id,
        label: p.nombre,
    }));

    useEffect(() => {
        if (consejoAEditar) {
            setFormData({
                cc: consejoAEditar.cc || "",
                rif: consejoAEditar.rif || "",
                situr: consejoAEditar.situr || "",
                numeroCuenta: consejoAEditar.numeroCuenta || "",
                fechaConstitucion: new Date(consejoAEditar.fechaConstitucion).toISOString().split('T')[0],
                fechaVencimiento: new Date(consejoAEditar.fechaVencimiento).toISOString().split('T')[0],
                poblacionVotante: consejoAEditar.poblacionVotante || 0,
                parroquiaId: consejoAEditar.parroquiaId,
                comunaId: consejoAEditar.comunaId,
                titularesComisionElectoralIds: consejoAEditar.titularesComisionElectoral.map(v => v.id!).filter(Boolean),
                suplentesComisionElectoralIds: consejoAEditar.suplentesComisionElectoral.map(v => v.id!).filter(Boolean),
                titularesContraloriaIds: consejoAEditar.titularesContraloria.map(v => v.id!).filter(Boolean),
                suplentesContraloriaIds: consejoAEditar.suplentesContraloria.map(v => v.id!).filter(Boolean),
                titularesFinanzasIds: consejoAEditar.titularesFinanzas.map(v => Number(v.id)).filter(Boolean), 
                suplentesFinanzasIds: consejoAEditar.suplentesFinanzas.map(v => v.id!).filter(Boolean),
            });
            
            const ejecutivas: { tipoVoceriaId: number; titularId?: number; suplenteId?: number }[] = [];
            
            consejoAEditar.vocerias.forEach(v => {
                ejecutivas.push({
                    tipoVoceriaId: v.tipoVoceria.id,
                    titularId: v.titular?.id,
                    suplenteId: v.suplente?.id,
                });
            });

            setVoceriasEjecutivas(ejecutivas);
        }
    }, [consejoAEditar]); // Dependencias simplificadas
    
    if (isConsejoLoading) {
        return <Tittle title="Cargando datos para edición..." />;
    }
    
    if (!consejoAEditar) {
        return null; // El useEffect ya maneja la redirección/error
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | number = value;

        if (name === "numeroCuenta") {
            newValue = value.replace(/[^0-9]/g, '');
        }

        if (name === "rif") {
            let cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            const letter = cleaned.charAt(0);
            if (letter.match(/[A-Z]/) && cleaned.length > 0) {
                cleaned = cleaned.substring(1);
            } else {
                setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
                return;
            }
            
            const numbers = cleaned.replace(/[^0-9]/g, '').slice(0, 9);
            
            let formattedValue = letter;
            if (numbers.length > 0) {
                formattedValue += '-' + numbers.slice(0, 8);
            }
            if (numbers.length > 8) {
                formattedValue += '-' + numbers.slice(8, 9);
            }

            newValue = formattedValue;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? Number(newValue) : newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const {
            cc,
            rif,
            numeroCuenta,
            fechaConstitucion,
            fechaVencimiento,
            poblacionVotante,
            parroquiaId,
        } = formData;

        if (!cc || !rif || !numeroCuenta || !fechaConstitucion || !fechaVencimiento || poblacionVotante == null || !parroquiaId) {
            toast.error("Por favor completa todos los campos obligatorios.");
            return;
        }
        
        const rifRegex = /^[A-Z]-\d{8}-\d{1}$/;
        if (!rifRegex.test(rif)) {
            toast.error("El RIF debe tener el formato: Letra-8 dígitos-1 dígito (Ej: J-12345678-9).");
            return;
        }
        
        if (/[^0-9]/.test(numeroCuenta)) {
            toast.error("El número de cuenta solo debe contener dígitos.");
            return;
        }

        const payload: ConsejoComunalFormDataEdit = {
            ...formData,
            voceriasEjecutivas,
        };

        updateConsejo(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['consejoscomunal'] }); 
                queryClient.invalidateQueries({ queryKey: ['consejoscomunal', id] }); 
                toast.success("Consejo Comunal actualizado exitosamente!");
                router.push(`/consejos-comunales/${id}`);
            },
            onError: (error: any) => {
                toast.error(`Error al actualizar: ${error.message || "Intente de nuevo."}`);
            }
        });
    };

    return (
        <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
            <Tittle title={`Editar Consejo Comunal: ${consejoAEditar.cc}`} /> 

            <form onSubmit={handleSubmit} className="pt-6 px-6 space-y-8">
                {/* Información Básica */}
                <div>
                    <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Información Básica</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <FormInput id="cc" label="Nombre" value={formData.cc} onChange={handleChange} required />
                        <FormInput id="rif" label="RIF (Ej: J-12345678-9)" value={formData.rif} onChange={handleChange} required />
                        <FormInput id="situr" label="Código SITUR" value={formData.situr} onChange={handleChange} /> 
                        <FormInput id="numeroCuenta" label="N° de Cuenta (Solo números)" value={formData.numeroCuenta} onChange={handleChange} required />
                        
                        <div>
                            <label className="block text-sm mb-1">Parroquia</label>
                            <Select
                                options={parroquiaOptions}
                                onChange={selected => {
                                    const id = (selected as SingleValue<OptionType>)?.value;
                                    setFormData(prev => ({ ...prev, parroquiaId: id }));
                                }}
                                value={parroquiaOptions.find(p => p.value === formData.parroquiaId) || null} 
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Fechas y Estadísticas</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <FormInput
                            type="date"
                            id="fechaConstitucion"
                            label="Fecha de Constitución"
                            value={formData.fechaConstitucion}
                            onChange={handleChange}
                            required
                        />
                        <FormInput
                            type="date"
                            id="fechaVencimiento"
                            label="Fecha de Vencimiento"
                            value={formData.fechaVencimiento}
                            onChange={handleChange}
                            required
                        />
                        <FormInput
                            type="number"
                            id="poblacionVotante"
                            label="Población Votante"
                            value={formData.poblacionVotante}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                
                <div className="flex justify-center pt-6">
                    <Button 
                        onClick={handleSubmit} 
                        title={isPending ? "Actualizando..." : "Guardar Cambios"}
                        disabled={isPending}
                    />
                </div>
            </form>
        </div>
    );
};

export default EditConsejoPage;