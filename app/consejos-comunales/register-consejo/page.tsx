"use client";
import React, { useState } from "react";
import Select, { SingleValue, MultiValue } from "react-select";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Tittle from "@/components/Tittle";
import toast from "react-hot-toast";
import { useRegisterConsejoComunal } from "@/hooks/useRegisterConsejo";
import useParroquias from "@/hooks/useParroquias";
import { Persona } from "@/hooks/interfaces/persona.interface";
import { ConsejoComunalFormData, ConsejoComunal } from "@/hooks/interfaces/consejo.comunal.interface";
import Modal from "@/components/Modal";
import RegisterPersonaForm from "@/components/RegisterPersonaForm";
import { useTiposVoceria } from "@/hooks/useTiposVoceria";
import AddVoceriaModal from "@/components/AddVoceriaModal";
import useConsejos from "@/hooks/useConsejos";

const RegisterConsejoPage = () => {
    type OptionType = { value: number; label: string };

    const queryClient = useQueryClient();
    const { mutate: registerConsejo, isPending } = useRegisterConsejoComunal();
    const { data: parroquias = [] } = useParroquias();
    const { data: tiposVoceria = [] } = useTiposVoceria();
    const { data: consejosExistentes = [] } = useConsejos();
    const voceros = queryClient.getQueryData<Persona[]>(["personas"]) || [];

    // Función para obtener todos los IDs de voceros que ya están asignados en otros consejos
    const getAssignedVoceroIds = (allConsejos: ConsejoComunal[]) => {
        const assignedIds = new Set<number>();
        allConsejos.forEach(consejo => {
            consejo.titularesComisionElectoral?.forEach((v) => {
                if (v.id !== undefined) {
                    assignedIds.add(v.id);
                }
            });
            consejo.suplentesComisionElectoral?.forEach((v) => {
                if (v.id !== undefined) {
                    assignedIds.add(v.id);
                }
            });
            consejo.titularesContraloria?.forEach((v) => {
                if (v.id !== undefined) {
                    assignedIds.add(v.id);
                }
            });
            consejo.suplentesContraloria?.forEach((v) => {
                if (v.id !== undefined) {
                    assignedIds.add(v.id);
                }
            });
            consejo.titularesFinanzas?.forEach((v) => {
                if (v.id !== undefined) {
                    assignedIds.add(Number(v.id)); 
                }
            });
            consejo.suplentesFinanzas?.forEach((v) => {
                if (v.id !== undefined) {
                    assignedIds.add(v.id);
                }
            });
            consejo.vocerias.forEach(voceria => {
                if (voceria.titular?.id !== undefined) {
                    assignedIds.add(voceria.titular.id);
                }
                if (voceria.suplente?.id !== undefined) {
                    assignedIds.add(voceria.suplente.id);
                }
            });
        });
        return assignedIds;
    };

    const assignedVoceroIds = getAssignedVoceroIds(consejosExistentes as ConsejoComunal[]);

    const initialVoceroOptions: OptionType[] = voceros
        .filter(v => v.id !== undefined && !assignedVoceroIds.has(v.id))
        .map(v => ({
            value: v.id!,
            label: `${v.nombres} ${v.apellidos}`,
        }));

    const parroquiaOptions: OptionType[] = parroquias.map(p => ({
        value: p.id,
        label: p.nombre,
    }));

    const voceriasObligatorias = tiposVoceria.filter(v => v.esObligatoria);
    const voceriasOpcionales = tiposVoceria.filter(v => !v.esObligatoria);

    const [voceroOptionsState, setVoceroOptionsState] = useState<OptionType[]>(initialVoceroOptions);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalVoceriaOpen, setModalVoceriaOpen] = useState(false);

    const [formData, setFormData] = useState<ConsejoComunalFormData>({
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
    const [voceriasOpcionalesSeleccionadas, setVoceriasOpcionalesSeleccionadas] = useState<number[]>([]);

    const getAllSelectedVoceroIds = (): number[] => {
        const selectedIds = new Set<number>();

        formData.titularesComisionElectoralIds.forEach(id => selectedIds.add(id));
        formData.suplentesComisionElectoralIds.forEach(id => selectedIds.add(id));
        formData.titularesContraloriaIds.forEach(id => selectedIds.add(id));
        formData.suplentesContraloriaIds.forEach(id => selectedIds.add(id));
        formData.titularesFinanzasIds.forEach(id => selectedIds.add(id));
        formData.suplentesFinanzasIds.forEach(id => selectedIds.add(id));

        voceriasEjecutivas.forEach(voceria => {
            if (voceria.titularId) selectedIds.add(voceria.titularId);
            if (voceria.suplenteId) selectedIds.add(voceria.suplenteId);
        });

        return Array.from(selectedIds);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | number = value;

        if (name === "numeroCuenta") {
            // Lógica: Solo aceptar números para numeroCuenta
            newValue = value.replace(/[^0-9]/g, '');
        }

        if (name === "rif") {
            // Lógica: Normalizar el RIF a formato L-12345678-9
            let cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            
            // Si el primer carácter es una letra, la mantiene
            const letter = cleaned.charAt(0);
            if (letter.match(/[A-Z]/) && cleaned.length > 0) {
                cleaned = cleaned.substring(1);
            } else {
                // Si el usuario no ha metido una letra válida aún, no procesamos
                setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
                return;
            }
            
            // Limitar a 9 números
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

    const handleMultiSelectChange = (
        field: keyof ConsejoComunalFormData,
        selected: MultiValue<OptionType>
    ) => {
        const ids = selected.map(option => option.value);
        setFormData(prev => ({
            ...prev,
            [field]: ids,
        }));
    };

    const updateVoceria = (tipoId: number, role: "titularId" | "suplenteId", value?: number) => {
        setVoceriasEjecutivas(prev => {
            const index = prev.findIndex(v => v.tipoVoceriaId === tipoId);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = { ...updated[index], [role]: value };
                return updated;
            }
            return [...prev, { tipoVoceriaId: tipoId, [role]: value }];
        });
    };

    const agregarVoceriaOpcional = (tipoId: number) => {
        if (!voceriasOpcionalesSeleccionadas.includes(tipoId)) {
            setVoceriasOpcionalesSeleccionadas(prev => [...prev, tipoId]);
        }
    };

    const handleNuevaPersona = (nuevaPersona: Persona) => {
        const nuevaOpcion: OptionType = {
            value: nuevaPersona.id!,
            label: `${nuevaPersona.nombres} ${nuevaPersona.apellidos}`,
        };
        setVoceroOptionsState(prev => [nuevaOpcion, ...prev]);
        setModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const {
            cc,
            rif,
            situr,
            numeroCuenta,
            fechaConstitucion,
            fechaVencimiento,
            poblacionVotante,
            parroquiaId,
            titularesComisionElectoralIds,
            suplentesComisionElectoralIds,
            titularesContraloriaIds,
            suplentesContraloriaIds,
            titularesFinanzasIds,
            suplentesFinanzasIds
        } = formData;

        // Validación de campos básicos
        if (!cc || !rif || !numeroCuenta || !fechaConstitucion || !fechaVencimiento || poblacionVotante == null || !parroquiaId) {
            toast.error("Por favor completa todos los campos obligatorios.");
            return;
        }
        
        // VALIDACIÓN RIF: Debe coincidir con el formato L-12345678-9
        const rifRegex = /^[A-Z]-\d{8}-\d{1}$/;
        if (!rifRegex.test(rif)) {
             toast.error("El RIF debe tener el formato: Letra-8 dígitos-1 dígito (Ej: J-12345678-9).");
             return;
        }
        
        // VALIDACIÓN NÚMERO DE CUENTA: Solo números (aunque handleChange ya limpia, es una seguridad)
        if (/[^0-9]/.test(numeroCuenta)) {
             toast.error("El número de cuenta solo debe contener dígitos.");
             return;
        }

        const voceriasPrincipales = [
            { name: 'Comisión Electoral', titulares: titularesComisionElectoralIds, suplentes: suplentesComisionElectoralIds },
            { name: 'Unidad de Contraloría Social', titulares: titularesContraloriaIds, suplentes: suplentesContraloriaIds },
            { name: 'Unidad Administrativa y Financiera', titulares: titularesFinanzasIds, suplentes: suplentesFinanzasIds },
        ];

        for (const voceria of voceriasPrincipales) {
            if (voceria.titulares.length !== 5 || voceria.suplentes.length !== 5) {
                toast.error(`La ${voceria.name} debe tener exactamente 5 titulares y 5 suplentes.`);
                return;
            }
        }

        for (const voceria of voceriasObligatorias) {
            const voceriaAsignada = voceriasEjecutivas.find(v => v.tipoVoceriaId === voceria.id);
            if (!voceriaAsignada || !voceriaAsignada.titularId) {
                toast.error(`Debes asignar titular para la vocería obligatoria: ${voceria.nombre}`);
                return;
            }
        }

        const payload = {
            ...formData,
            voceriasEjecutivas,
        };

        registerConsejo(payload);
    };

    const allCurrentSelectedIds = new Set(getAllSelectedVoceroIds());
    const allAvailableOptions = voceroOptionsState.filter(option => !allCurrentSelectedIds.has(option.value));

    return (
        <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
            <Tittle title="Registrar Consejo Comunal" />

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
                            value={typeof formData.fechaConstitucion === "string"
                                ? formData.fechaConstitucion
                                : formData.fechaConstitucion instanceof Date
                                    ? formData.fechaConstitucion.toISOString().slice(0, 10)
                                    : ""}
                            onChange={handleChange}
                        />
                        <FormInput
                            type="date"
                            id="fechaVencimiento"
                            label="Fecha de Vencimiento"
                            value={typeof formData.fechaVencimiento === "string"
                                ? formData.fechaVencimiento
                                : formData.fechaVencimiento instanceof Date
                                    ? formData.fechaVencimiento.toISOString().slice(0, 10)
                                    : ""}
                            onChange={handleChange}
                        />
                        <FormInput
                            type="number"
                            id="poblacionVotante"
                            label="Población Votante"
                            value={formData.poblacionVotante}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Vocerías Principales */}
                {/* ... (código para Vocerías Principales) ... */}
                <div>
                    <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Vocerías Principales</h3>

                    <div className="absolute top-[400px] right-[60px] group">
                        <Button title="+ Registrar nuevo vocero" onClick={() => setModalOpen(true)} type="button" />
                        <div className="absolute top-[-2.2rem] right-[-0.5rem] w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Registrar nuevo vocero
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { id: "titularesComisionElectoralIds", suplenteId: "suplentesComisionElectoralIds", label: "Comisión Electoral" },
                            { id: "titularesContraloriaIds", suplenteId: "suplentesContraloriaIds", label: "Unidad de Contraloría Social" },
                            { id: "titularesFinanzasIds", suplenteId: "suplentesFinanzasIds", label: "Unidad Administrativa y Financiera Comunitaria" },
                        ].map(voceria => {
                            const currentTitulares = formData[voceria.id as keyof ConsejoComunalFormData] as number[] || [];
                            const currentSuplentes = formData[voceria.suplenteId as keyof ConsejoComunalFormData] as number[] || [];
                                
                            const availableOptionsForTitular = allAvailableOptions.concat(
                                currentTitulares.map(id => voceroOptionsState.find(opt => opt.value === id)!).filter(Boolean)
                            );
                                
                            const availableOptionsForSuplente = allAvailableOptions.concat(
                                currentSuplentes.map(id => voceroOptionsState.find(opt => opt.value === id)!).filter(Boolean)
                            );
                                
                            return (
                                <div key={voceria.id} className="border p-4 rounded-md bg-white shadow-sm">
                                    <p className="text-sky-900 font-bold mb-2">{voceria.label}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-700 block mb-1">Titular (5)</label>
                                            <Select
                                                placeholder="Seleccionar Titulares"
                                                options={availableOptionsForTitular}
                                                onChange={selected =>
                                                    handleMultiSelectChange(voceria.id as keyof ConsejoComunalFormData, selected as MultiValue<OptionType>)
                                                }
                                                value={currentTitulares.map(id =>
                                                    voceroOptionsState.find(option => option.value === id)!
                                                )}
                                                isMulti
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-700 block mb-1">Suplente (5)</label>
                                            <Select
                                                placeholder="Seleccionar Suplentes"
                                                options={availableOptionsForSuplente}
                                                onChange={selected =>
                                                    handleMultiSelectChange(voceria.suplenteId as keyof ConsejoComunalFormData, selected as MultiValue<OptionType>)
                                                }
                                                value={currentSuplentes.map(id =>
                                                    voceroOptionsState.find(option => option.value === id)!
                                                )}
                                                isMulti
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Vocerías Ejecutivas Obligatorias */}
                {/* ... (código para Vocerías Ejecutivas Obligatorias) ... */}
                <div>
                    <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Vocerías Ejecutivas Obligatorias</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {voceriasObligatorias.map(tipo => {
                            const voceriaAsignada = voceriasEjecutivas.find(v => v.tipoVoceriaId === tipo.id);
                            const currentTitularId = voceriaAsignada?.titularId;
                            const currentSuplenteId = voceriaAsignada?.suplenteId;
                            
                            const availableOptionsForTitular = allAvailableOptions.concat(
                                currentTitularId ? [voceroOptionsState.find(opt => opt.value === currentTitularId)!] : []
                            ).filter(Boolean);

                            const availableOptionsForSuplente = allAvailableOptions.concat(
                                currentSuplenteId ? [voceroOptionsState.find(opt => opt.value === currentSuplenteId)!] : []
                            ).filter(Boolean);
                            
                            return (
                                <div key={tipo.id} className="col-span-1 border p-3 rounded">
                                    <p className="font-medium text-sm text-sky-800">
                                        {tipo.nombre} <span className="text-red-600">*</span>
                                    </p>
                                    <Select
                                        placeholder="Titular"
                                        options={availableOptionsForTitular}
                                        value={voceroOptionsState.find(option => option.value === voceriaAsignada?.titularId) || null}
                                        onChange={selected => updateVoceria(tipo.id, "titularId", (selected as SingleValue<OptionType>)?.value)}
                                        isClearable
                                    />
                                    <Select
                                        className="mt-2"
                                        placeholder="Suplente"
                                        options={availableOptionsForSuplente}
                                        value={voceroOptionsState.find(option => option.value === voceriaAsignada?.suplenteId) || null}
                                        onChange={selected => updateVoceria(tipo.id, "suplenteId", (selected as SingleValue<OptionType>)?.value)}
                                        isClearable
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Vocerías Opcionales */}
                {/* ... (código para Vocerías Opcionales) ... */}
                <div className="mt-6 flex justify-end">
                    <Button onClick={() => setModalVoceriaOpen(true)} title="Agregar Vocería Opcional" />
                </div>

                {voceriasOpcionalesSeleccionadas.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Vocerías Ejecutivas Opcionales</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {voceriasOpcionales
                                .filter(tipo => voceriasOpcionalesSeleccionadas.includes(tipo.id))
                                .map(tipo => {
                                    const voceriaAsignada = voceriasEjecutivas.find(v => v.tipoVoceriaId === tipo.id);
                                    const currentTitularId = voceriaAsignada?.titularId;
                                    const currentSuplenteId = voceriaAsignada?.suplenteId;
                                    
                                    const availableOptionsForTitular = allAvailableOptions.concat(
                                        currentTitularId ? [voceroOptionsState.find(opt => opt.value === currentTitularId)!] : []
                                    ).filter(Boolean);

                                    const availableOptionsForSuplente = allAvailableOptions.concat(
                                        currentSuplenteId ? [voceroOptionsState.find(opt => opt.value === currentSuplenteId)!] : []
                                    ).filter(Boolean);
                                    
                                    return (
                                        <div key={tipo.id} className="col-span-1 border p-3 rounded">
                                            <p className="font-medium text-sm text-sky-800">{tipo.nombre}</p>
                                            <Select
                                                placeholder="Titular"
                                                options={availableOptionsForTitular}
                                                value={voceroOptionsState.find(option => option.value === voceriaAsignada?.titularId) || null}
                                                onChange={selected => updateVoceria(tipo.id, "titularId", (selected as SingleValue<OptionType>)?.value)}
                                                isClearable
                                            />
                                            <Select
                                                className="mt-2"
                                                placeholder="Suplente"
                                                options={availableOptionsForSuplente}
                                                value={voceroOptionsState.find(option => option.value === voceriaAsignada?.suplenteId) || null}
                                                onChange={selected => updateVoceria(tipo.id, "suplenteId", (selected as SingleValue<OptionType>)?.value)}
                                                isClearable
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}

                <div className="flex justify-center pt-6">
                    <Button 
                      onClick={handleSubmit} 
                      title={isPending ? "Registrando..." : "Registrar Consejo Comunal"}
                      disabled={isPending}
                    />
                </div>
            </form>

            {/* Modal Persona */}
            <Modal open={isModalOpen} onClose={() => setModalOpen(false)} title="Registrar nueva Persona">
                <RegisterPersonaForm onSuccess={handleNuevaPersona} />
            </Modal>

            {/* Modal Vocería Opcional */}
            <AddVoceriaModal
                open={modalVoceriaOpen}
                onClose={() => setModalVoceriaOpen(false)}
                onAddVoceria={ids => {
                    ids.forEach(id => agregarVoceriaOpcional(id));
                    setModalVoceriaOpen(false);
                }}
                voceriasOpcionales={voceriasOpcionales}
                voceriasOpcionalesSeleccionadas={voceriasOpcionalesSeleccionadas}
            />
        </div>
    );
};

export default RegisterConsejoPage;