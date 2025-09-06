"use client";

import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Tittle from "@/components/Tittle";
import toast from "react-hot-toast";
import { useRegisterConsejoComunal } from "@/hooks/useRegisterConsejo";
import useParroquias from "@/hooks/useParroquias";
import { Persona } from "@/hooks/interfaces/persona.interface";
import { ConsejoComunalFormData } from "@/hooks/interfaces/consejo.comunal.interface";
import Modal from "@/components/Modal";
import RegisterPersonaForm from "@/components/RegisterPersonaForm";
import { useTiposVoceria } from "@/hooks/useTiposVoceria";
import AddVoceriaModal from "@/components/AddVoceriaModal";


const RegisterConsejoPage = () => {
  type OptionType = { value: number; label: string };

  const queryClient = useQueryClient();
  const { mutate: registerConsejo } = useRegisterConsejoComunal();
  const { data: parroquias = [] } = useParroquias();
  const { data: tiposVoceria = [] } = useTiposVoceria();
  const voceros = queryClient.getQueryData<Persona[]>(["personas"]) || [];

  const initialVoceroOptions: OptionType[] = voceros.map(v => ({
    value: v.id!,
    label: `${v.nombres} ${v.apellidos}`,
  }));

  const parroquiaOptions: OptionType[] = parroquias.map(p => ({
    value: p.id,
    label: p.nombre,
  }));

  // Separar vocerías obligatorias y opcionales
  const voceriasObligatorias = tiposVoceria.filter(v => v.esObligatoria);
  const voceriasOpcionales = tiposVoceria.filter(v => !v.esObligatoria);

  const [voceroOptionsState, setVoceroOptionsState] = useState<OptionType[]>(initialVoceroOptions);
  const [isModalOpen, setModalOpen] = useState(false);

  // Modal para seleccionar vocerías opcionales para agregar
  const [modalVoceriaOpen, setModalVoceriaOpen] = useState(false);

  const [formData, setFormData] = useState<ConsejoComunalFormData>({
    cc: "",
    rif: "",
    numeroCuenta: "",
    fechaConstitucion: "",
    fechaVencimiento: "",
    poblacionVotante: 0,
    parroquiaId: undefined,
    comunaId: undefined,
    comisionElectoralId: undefined,
    suplenteComisionElectoralId: undefined,
    contraloriaId: undefined,
    suplenteContraloriaId: undefined,
    finanzasId: undefined,
    suplenteFinanzasId: undefined,
  });

  // Estado para vocerías ejecutivas
  const [voceriasEjecutivas, setVoceriasEjecutivas] = useState<
    { tipoVoceriaId: number; titularId?: number; suplenteId?: number }[]
  >([]);

  // Estado para vocerías opcionales agregadas
  const [voceriasOpcionalesSeleccionadas, setVoceriasOpcionalesSeleccionadas] = useState<number[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (
    field: keyof ConsejoComunalFormData,
    selected: SingleValue<OptionType>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: selected ? selected.value : undefined,
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

  // Agregar vocería opcional seleccionada desde modal
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
      numeroCuenta,
      fechaConstitucion,
      fechaVencimiento,
      poblacionVotante,
      parroquiaId,
      comisionElectoralId,
      contraloriaId,
      finanzasId,
    } = formData;

    if (!cc || !rif || !numeroCuenta || !fechaConstitucion || !fechaVencimiento || !poblacionVotante || !parroquiaId) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!comisionElectoralId || !contraloriaId || !finanzasId) {
      toast.error("Debes asignar las vocerías principales obligatorias.");
      return;
    }

    // Validar vocerías ejecutivas obligatorias: que tengan titular
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

  return (
    <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title="Registrar Consejo Comunal" />

      <form onSubmit={handleSubmit} className="pt-6 px-6 space-y-8">
        {/* Sección 1 */}
        <div>
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Información Básica</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormInput id="cc" label="Nombre" value={formData.cc} onChange={handleChange} required />
            <FormInput id="rif" label="RIF" value={formData.rif} onChange={handleChange} required />
            <FormInput id="numeroCuenta" label="N° de Cuenta" value={formData.numeroCuenta} onChange={handleChange} required />
            <div>
              <label className="block text-sm mb-1">Parroquia</label>
              <Select
                options={parroquiaOptions}
                onChange={selected => handleSelectChange("parroquiaId", selected)}
                value={parroquiaOptions.find(p => p.value === formData.parroquiaId)}
              />
            </div>
          </div>
        </div>

        {/* Sección 2 */}
        <div>
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Fechas y Estadísticas</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormInput
              type="date"
              id="fechaConstitucion"
              label="Fecha de Constitución"
              value={
                typeof formData.fechaConstitucion === "string"
                  ? formData.fechaConstitucion
                  : formData.fechaConstitucion instanceof Date
                  ? formData.fechaConstitucion.toISOString().slice(0, 10)
                  : ""
              }
              onChange={handleChange}
            />
            <FormInput
              type="date"
              id="fechaVencimiento"
              label="Fecha de Vencimiento"
              value={
                typeof formData.fechaVencimiento === "string"
                  ? formData.fechaVencimiento
                  : formData.fechaVencimiento instanceof Date
                  ? formData.fechaVencimiento.toISOString().slice(0, 10)
                  : ""
              }
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
        <div>
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">
            Vocerías Principales
          </h3>

          <div className="absolute top-[400px] right-[60px] group">
            <Button title="+ Registrar nuevo vocero" onClick={() => setModalOpen(true)} type="button" />
            <div className="absolute top-[-2.2rem] right-[-0.5rem] w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Registrar nuevo vocero
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: "comisionElectoralId", suplenteId: "suplenteComisionElectoralId", label: "Comisión Electoral" },
              { id: "contraloriaId", suplenteId: "suplenteContraloriaId", label: "Unidad de Contraloría Social" },
              { id: "finanzasId", suplenteId: "suplenteFinanzasId", label: "Unidad Administrativa y Financiera Comunitaria" },
            ].map((voceria) => (
              <div key={voceria.id} className="border p-4 rounded-md bg-white shadow-sm">
                <p className="text-sky-900 font-bold mb-2">{voceria.label}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 block mb-1">Titular</label>
                    <Select
                      placeholder="Seleccionar Titular"
                      options={voceroOptionsState}
                      value={voceroOptionsState.find(v => v.value === formData[voceria.id as keyof typeof formData])}
                      onChange={(selected) =>
                        handleSelectChange(voceria.id as keyof typeof formData, selected)
                      }
                      isClearable
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 block mb-1">Suplente</label>
                    <Select
                      placeholder="Seleccionar Suplente"
                      options={voceroOptionsState}
                      value={voceroOptionsState.find(v => v.value === formData[voceria.suplenteId as keyof typeof formData])}
                      onChange={(selected) =>
                        handleSelectChange(voceria.suplenteId as keyof typeof formData, selected)
                      }
                      isClearable
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Vocerías Ejecutivas Obligatorias */}
        <div>
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Vocerías Ejecutivas Obligatorias</h3>
          <div className="grid grid-cols-2 gap-4">
            {voceriasObligatorias.map(tipo => {
              const voceriaAsignada = voceriasEjecutivas.find(v => v.tipoVoceriaId === tipo.id);
              return (
                <div key={tipo.id} className="col-span-1 border p-3 rounded">
                  <p className="font-medium text-sm text-sky-800">
                    {tipo.nombre} <span className="text-red-600">*</span>
                  </p>
                  <Select
                    placeholder="Titular"
                    options={voceroOptionsState}
                    value={voceroOptionsState.find(v => v.value === voceriaAsignada?.titularId)}
                    onChange={selected => updateVoceria(tipo.id, "titularId", selected?.value)}
                    isClearable
                  />
                  <Select
                    className="mt-2"
                    placeholder="Suplente"
                    options={voceroOptionsState}
                    value={voceroOptionsState.find(v => v.value === voceriaAsignada?.suplenteId)}
                    onChange={selected => updateVoceria(tipo.id, "suplenteId", selected?.value)}
                    isClearable
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón para abrir modal de vocerías opcionales */}
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setModalVoceriaOpen(true)} title="Agregar Vocería Opcional" />
        </div>

        {/* Vocerías Ejecutivas Opcionales Seleccionadas */}
        {voceriasOpcionalesSeleccionadas.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">Vocerías Ejecutivas Opcionales</h3>
            <div className="grid grid-cols-2 gap-4">
              {voceriasOpcionales
                .filter(v => voceriasOpcionalesSeleccionadas.includes(v.id))
                .map(tipo => {
                  const voceriaAsignada = voceriasEjecutivas.find(v => v.tipoVoceriaId === tipo.id);
                  return (
                    <div key={tipo.id} className="col-span-1 border p-3 rounded">
                      <p className="font-medium text-sm text-sky-800">{tipo.nombre}</p>
                      <Select
                        placeholder="Titular"
                        options={voceroOptionsState}
                        value={voceroOptionsState.find(v => v.value === voceriaAsignada?.titularId)}
                        onChange={selected => updateVoceria(tipo.id, "titularId", selected?.value)}
                        isClearable
                      />
                      <Select
                        className="mt-2"
                        placeholder="Suplente"
                        options={voceroOptionsState}
                        value={voceroOptionsState.find(v => v.value === voceriaAsignada?.suplenteId)}
                        onChange={selected => updateVoceria(tipo.id, "suplenteId", selected?.value)}
                        isClearable
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Botón Registrar */}
        <div className="flex justify-center pt-6">
          <Button onClick={handleSubmit} title="Registrar Consejo Comunal" />
        </div>
      </form>

      {/* Modal para registrar nueva persona */}
      <Modal open={isModalOpen} onClose={() => setModalOpen(false)} title="Registrar nueva Persona">
        <RegisterPersonaForm onSuccess={handleNuevaPersona} />
      </Modal>

      {/* Modal para seleccionar vocería opcional */}
      <AddVoceriaModal
        open={modalVoceriaOpen}
        onClose={() => setModalVoceriaOpen(false)}
        onAddVoceria={(ids) => {
          ids.forEach((id) => agregarVoceriaOpcional(id));
          setModalVoceriaOpen(false);
        }}
        voceriasOpcionales={voceriasOpcionales}
        voceriasOpcionalesSeleccionadas={voceriasOpcionalesSeleccionadas}
      />
    </div>
  );
};

export default RegisterConsejoPage;
