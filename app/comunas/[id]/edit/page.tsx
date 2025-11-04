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
import useComunas from "@/hooks/useComunas"; 
import { ComunaFormData } from "@/hooks/interfaces/comuna.interface"; 
import { useUpdateComuna } from "@/hooks/useUpdateComuna"; 

const EditComunaPage = () => {
    type OptionType = { value: number; label: string };

    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const queryClient = useQueryClient();
    const { data: parroquias = [] } = useParroquias();
    const { data: comunasExistentes = [], isLoading: isLoadingComunas } = useComunas();

    const { mutate: updateComuna, isPending } = useUpdateComuna(id);

    const comunaAEditar = comunasExistentes.find(c => c.id === id);
    const isComunaLoading = isLoadingComunas && !comunaAEditar;

    useEffect(() => {
        if (!isComunaLoading && !comunaAEditar && id) {
            toast.error("Comuna no encontrada.");
            router.push('/comunas');
        }
    }, [isComunaLoading, comunaAEditar, id, router]);

    const [formData, setFormData] = useState<ComunaFormData>({
        codigo: "",
        numComisionPromotora: "",
        fechaComisionPromotora: "",
        rif: "",
        cuentaBancaria: "",
        fechaRegistro: "",
        nombre: "",
        direccion: "",
        linderoNorte: "",
        linderoSur: "",
        linderoEste: "",
        linderoOeste: "",
        consejosComunales: [],
        fechaUltimaEleccion: "",
        parroquiaId: 0,
        cantidadConsejosComunales: 0,
        poblacionVotante: 0,
        bancoDeLaComuna: [],
    });

    const parroquiaOptions: OptionType[] = parroquias.map(p => ({
        value: p.id,
        label: p.nombre,
    }));

    useEffect(() => {
        if (comunaAEditar) {
            setFormData({
                codigo: comunaAEditar.codigo || "",
                numComisionPromotora: comunaAEditar.numComisionPromotora || "",
                fechaComisionPromotora: comunaAEditar.fechaComisionPromotora ? new Date(comunaAEditar.fechaComisionPromotora).toISOString().split('T')[0] : "",
                rif: comunaAEditar.rif || "",
                cuentaBancaria: comunaAEditar.cuentaBancaria || "",
                fechaRegistro: comunaAEditar.fechaRegistro ? new Date(comunaAEditar.fechaRegistro).toISOString().split('T')[0] : "",
                nombre: comunaAEditar.nombre || "",
                direccion: comunaAEditar.direccion || "",
                linderoNorte: comunaAEditar.linderoNorte || "",
                linderoSur: comunaAEditar.linderoSur || "",
                linderoEste: comunaAEditar.linderoEste || "",
                linderoOeste: comunaAEditar.linderoOeste || "",
                // Estos campos de relación y calculados se inicializan, pero se excluyen del PUT
                consejosComunales: [], 
                fechaUltimaEleccion: comunaAEditar.fechaUltimaEleccion ? new Date(comunaAEditar.fechaUltimaEleccion).toISOString().split('T')[0] : "",
                parroquiaId: comunaAEditar.parroquiaRelation?.id || 0,
                cantidadConsejosComunales: comunaAEditar.cantidadConsejosComunales || 0,
                poblacionVotante: comunaAEditar.poblacionVotante || 0,
                bancoDeLaComuna: [],
            });
        }
    }, [comunaAEditar]);

    if (isComunaLoading) {
        return <Tittle title="Cargando datos de la Comuna..." />;
    }

    if (!comunaAEditar) {
        return null; 
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | number = value;

        if (name === "rif") {
            let cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            const letter = cleaned.charAt(0);
            
            if (letter.match(/[A-Z]/) && cleaned.length > 0) {
                const numbers = cleaned.substring(1).replace(/[^0-9]/g, '').slice(0, 9);
                
                let formattedValue = letter;
                if (numbers.length > 0) {
                    formattedValue += '-' + numbers.slice(0, 8);
                }
                if (numbers.length > 8) {
                    formattedValue += '-' + numbers.slice(8, 9);
                }
                newValue = formattedValue;
            } else {
                newValue = value.toUpperCase();
            }
        }
        
        if (name === "cuentaBancaria") {
            newValue = value.replace(/[^0-9]/g, '');
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? Number(newValue) : newValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { nombre, rif, cuentaBancaria, parroquiaId, linderoNorte, linderoSur, linderoEste, linderoOeste } = formData;
        
        // Validación básica
        if (!nombre || !rif || !cuentaBancaria || !parroquiaId || !linderoNorte || !linderoSur || !linderoEste || !linderoOeste) {
            toast.error("Por favor completa todos los campos obligatorios.");
            return;
        }
        
        const rifRegex = /^[A-Z]-\d{8}-\d{1}$/;
        if (!rifRegex.test(rif)) {
            toast.error("El RIF debe tener el formato: Letra-8 dígitos-1 dígito (Ej: J-12345678-9).");
            return;
        }

        // 💡 CLAVE: Usamos desestructuración para EXCLUIR las propiedades de relación/cálculo
        const {
            consejosComunales, 
            bancoDeLaComuna, 
            poblacionVotante, 
            cantidadConsejosComunales, 
            ...dataToUpdate // Los campos restantes (básicos)
        } = formData;

        // Enviamos solo los campos básicos para actualizar la fila de la Comuna
        updateComuna(dataToUpdate as ComunaFormData, { 
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['comunas'] }); 
                queryClient.invalidateQueries({ queryKey: ['comunas', id] }); 
                toast.success("Comuna actualizada exitosamente!");
                router.push(`/comunas/${id}`);
            },
            onError: (error: any) => {
                toast.error(`Error al actualizar: ${error.message || "Intente de nuevo."}`);
            }
        });
    };

    return (
        <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
            <Tittle title={`Editar Comuna: ${comunaAEditar.nombre}`} /> 

            <form onSubmit={handleSubmit} className="pt-6 px-6 space-y-8">
                {/* Información Básica */}
                <div>
                    <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Información Básica</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <FormInput id="nombre" label="Nombre" value={formData.nombre} onChange={handleChange} required />
                        <FormInput id="codigo" label="Código SITUR" value={formData.codigo} onChange={handleChange} required />
                        <FormInput id="rif" label="RIF (Ej: J-12345678-9)" value={formData.rif} onChange={handleChange} required />
                        <FormInput id="cuentaBancaria" label="N° de Cuenta Bancaria" value={formData.cuentaBancaria} onChange={handleChange} required />
                    </div>
                </div>
                
                {/* Linderos */}
                <div>
                    <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Ubicación Geográfica</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Parroquia</label>
                            <Select
                                options={parroquiaOptions}
                                onChange={selected => {
                                    const id = (selected as SingleValue<OptionType>)?.value;
                                    setFormData(prev => ({ ...prev, parroquiaId: id || 0 }));
                                }}
                                value={parroquiaOptions.find(p => p.value === formData.parroquiaId) || null} 
                                required
                            />
                        </div>
                        <FormInput id="direccion" label="Dirección" value={formData.direccion} onChange={handleChange} required />
                        <FormInput id="linderoNorte" label="Lindero Norte" value={formData.linderoNorte} onChange={handleChange} required />
                        <FormInput id="linderoSur" label="Lindero Sur" value={formData.linderoSur} onChange={handleChange} required />
                        <FormInput id="linderoEste" label="Lindero Este" value={formData.linderoEste} onChange={handleChange} required />
                        <FormInput id="linderoOeste" label="Lindero Oeste" value={formData.linderoOeste} onChange={handleChange} required />
                    </div>
                </div>

                {/* Datos Legales */}
                <div>
                    <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Datos Legales y Registro</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <FormInput
                            type="date"
                            id="fechaRegistro"
                            label="Fecha de Registro"
                            value={formData.fechaRegistro}
                            onChange={handleChange}
                            required
                        />
                        <FormInput
                            type="date"
                            id="fechaUltimaEleccion"
                            label="Fecha Última Elección"
                            value={formData.fechaUltimaEleccion}
                            onChange={handleChange}
                            required
                        />
                        <FormInput
                            id="numComisionPromotora"
                            label="N° Comisión Promotora"
                            value={formData.numComisionPromotora}
                            onChange={handleChange}
                            required
                        />
                        <FormInput
                            type="date"
                            id="fechaComisionPromotora"
                            label="Fecha Comisión Promotora"
                            value={formData.fechaComisionPromotora}
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

export default EditComunaPage;