"use client";
import React, { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Tittle from "@/components/Tittle";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { useVehiculos } from "@/hooks/useVehiculos"; 
import { useUpdateVehiculo } from "@/hooks/useUpdateVehiculo"; 
import { VehiculoFormData } from "@/hooks/interfaces/vehiculo.interface";

type OptionType = { value: string; label: string };

const VEHICULO_STATUS_OPTIONS: OptionType[] = [
    { value: "asignado", label: "Asignado" },
    { value: "extraviado", label: "Extraviado" },
    { value: "devuelto_a_caracas", label: "Devuelto a Caracas" },
    { value: "inactivo", label: "Inactivo" },
];

const EditVehiculoPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = parseInt(params.id as string);

    const { data: vehiculosData = [], isLoading: isLoadingVehiculos } = useVehiculos();
    
    const vehiculoAEditar = vehiculosData.find(v => v.id === id); 
    const isVehiculoLoading = isLoadingVehiculos && !vehiculoAEditar;
    
    const { mutate: updateVehiculo, isPending } = useUpdateVehiculo(id || 0); 

    const [formData, setFormData] = useState<VehiculoFormData>({
        placa: "",
        clase: "",
        marca: "",
        cc: "",
        modelo: "",
        color: "",
        ano: 0,
        serialCarroceria: "",
        fechaDeEntrega: "", 
        estatus: "",
        observacionArchivo: "", 
        observacion: "",
    });

    const [currentArchivoUrl, setCurrentArchivoUrl] = useState<string | null>(null);
    const [deleteCurrentArchivo, setDeleteCurrentArchivo] = useState(false);
    
    useEffect(() => {
        if (!isVehiculoLoading && !vehiculoAEditar && id) {
            toast.error("Vehículo no encontrado.");
            router.push('/vehiculos'); 
        } else if (vehiculoAEditar) {
            const fechaEntrega = new Date(vehiculoAEditar.fechaDeEntrega).toISOString().split('T')[0];
            
            setFormData({
                placa: vehiculoAEditar.placa,
                clase: vehiculoAEditar.clase,
                cc: vehiculoAEditar.consejoComunal?.cc || "",
                marca: vehiculoAEditar.marca,
                modelo: vehiculoAEditar.modelo,
                color: vehiculoAEditar.color,
                ano: vehiculoAEditar.ano,
                serialCarroceria: vehiculoAEditar.serialCarroceria,
                fechaDeEntrega: fechaEntrega,
                estatus: vehiculoAEditar.estatus,
                observacionArchivo: vehiculoAEditar.observacionArchivo || "",
                observacion: vehiculoAEditar.observacion || "",
            });
            setCurrentArchivoUrl(vehiculoAEditar.observacionArchivo || null);
        }
    }, [isVehiculoLoading, vehiculoAEditar, id, router]);

    if (isVehiculoLoading) {
        return <Loading />;
    }
    
    if (!vehiculoAEditar) {
        return null; 
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | number | File | null = value;

        if (type === "number") {
            newValue = Number(value);
        }

        if (type === "file") {
            const file = (e.target as HTMLInputElement).files?.[0];
            newValue = file || "";
            // Si se selecciona un nuevo archivo, se anula la eliminación
            if (file) setDeleteCurrentArchivo(false); 
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };
    
    const handleEstatusChange = (selected: SingleValue<OptionType>) => {
        setFormData(prev => ({ ...prev, estatus: selected ? selected.value : "" }));
    };

    const handleFileDeleteToggle = (checked: boolean) => {
        setDeleteCurrentArchivo(checked);
        // Si se marca para eliminar, borramos el archivo del state para no enviarlo
        if (checked) {
            setFormData(prev => ({ ...prev, observacionArchivo: '' })); 
        } else {
             // Si se desmarca, restauramos la URL original (si existe)
            setFormData(prev => ({ ...prev, observacionArchivo: currentArchivoUrl || "" }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validación de campos obligatorios
        const { placa, clase, marca, modelo, color, ano, serialCarroceria, estatus } = formData;
        if (!placa || !clase || !marca || !modelo || !color || ano === 0 || !serialCarroceria || !estatus) {
            toast.error("Por favor completa todos los campos obligatorios.");
            return;
        }

        // 1. Preparar el payload
        const payload: VehiculoFormData = {
            ...formData,
        };
        
        // 2. Manejar la señal de eliminación del archivo
        if (deleteCurrentArchivo) {
             // Si el usuario marcó "Eliminar archivo", enviamos la señal al backend
            payload.observacionArchivo = 'DELETE_FILE_SIGNAL' as unknown as string;
        } 
        // Si el formData.observacionArchivo es un string, significa que es la URL antigua, la conservamos
        // Si es un File, se enviará el objeto File.

        updateVehiculo(payload, {
            onSuccess: () => {
                toast.success("Vehículo actualizado exitosamente!");
                router.push(`/vehiculos/${id}`);
            },
            // onError lo maneja el hook
        });
    };

    return (
        <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
            <Tittle title={`Editar Vehículo: ${vehiculoAEditar.placa}`} /> 

            <form onSubmit={handleSubmit} className="pt-6 px-6 space-y-8">
                {/* Información Básica */}
                <div>
                    <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Información General</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <FormInput id="placa" label="Placa" value={formData.placa} onChange={handleChange} required />
                        <FormInput id="clase" label="Clase" value={formData.clase} onChange={handleChange} required />
                        <FormInput id="marca" label="Marca" value={formData.marca} onChange={handleChange} required />
                        <FormInput id="modelo" label="Modelo" value={formData.modelo} onChange={handleChange} required />
                        <FormInput id="color" label="Color" value={formData.color} onChange={handleChange} required />
                        <FormInput id="ano" label="Año" type="number" value={formData.ano} onChange={handleChange} required />
                        <FormInput id="serialCarroceria" label="Serial de Carrocería" value={formData.serialCarroceria} onChange={handleChange} required />
                        {/* <FormInput 
                            type="date"
                            id="fechaDeEntrega"
                            label="Fecha de Entrega"
                            value={formData.fechaDeEntrega}
                            onChange={handleChange}
                            required
                        /> */}
                    </div>
                </div>

                {/* Estado del Vehículo y Observaciones */}
                <div>
                    <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Estado y Documentación</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {/* SELECT ESTATUS */}
                        <div>
                            <label className="block text-sm mb-[10.4px]">Estatus</label>
                            <Select
                                options={VEHICULO_STATUS_OPTIONS}
                                onChange={handleEstatusChange}
                                value={VEHICULO_STATUS_OPTIONS.find(o => o.value === formData.estatus) || null} 
                                required
                            />
                        </div>

                        {/* INPUT OBSERVACIÓN */}
                        <div className="col-span-1">
                            <FormInput 
                                id="observacion" 
                                label="Observación" 
                                value={formData.observacion} 
                                onChange={handleChange} 
                            />
                        </div>
                        
                        {/* GESTIÓN DE ARCHIVO */}
                        
                        <div className="flex flex-col 2xl:flex-row gap-3 col-span-2">
                            {/* Mostrar archivo actual y opción de eliminar */}
                            <div>
                                {currentArchivoUrl && (
                                    <><label className="text-sm font-medium mb-2 text-sky-950">Observación Archivo</label><div className="mt-1 flex items-center justify-between min-h-[42px] p-2 2xl:p-1 rounded-md border border-gray-500 bg-white">
                                        <div className="flex items-center space-x-1">
                                            <a
                                                href={currentArchivoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sky-900 text-[12.4px] font-bold ml-1 hover:underline"
                                            >
                                                Ver Archivo Actual
                                            </a>

                                        </div>
                                        <span className="text-gray-500 text-sm">|</span>
                                        <label className="flex items-center ml-1 space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={deleteCurrentArchivo}
                                                onChange={(e) => handleFileDeleteToggle(e.target.checked)}
                                                className="accent-red-500"
                                                disabled={!!(formData.observacionArchivo instanceof File)} />
                                            <span className="text-red-700 text-[12.4px] font-bold ">Eliminar Archivo Actual</span>
                                        </label>
                                    </div></>
                                )}
                            </div>
                            <FormInput 
                                type="file"
                                id="observacionArchivo"
                                label="Subir Nuevo Archivo"
                                onChange={handleChange}
                                disabled={!!(formData.observacionArchivo instanceof File)}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-center">
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

export default EditVehiculoPage;