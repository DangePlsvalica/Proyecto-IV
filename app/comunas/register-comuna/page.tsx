"use client";
import React, { useState, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import Button from "@/components/Button";
import FormInput from '@/components/FormInput';
import { useQueryClient } from '@tanstack/react-query';
import { ConsejoComunal } from '@/hooks/interfaces/consejo.comunal.interface';
import { Parroquia } from '@/hooks/interfaces/parroquia.interface';
import { Persona } from '@/hooks/interfaces/comuna.interface';
import { useRegisterComuna } from '@/hooks/useRegisterComuna';
import Tittle from "@/components/Tittle";
import toast from "react-hot-toast"; 
import useParroquias from "@/hooks/useParroquias";

type SelectOption = { value: string; label: string };
type ParroquiaOption = { value: number; label: string };

const RegisterComunaPage = () => {
  const queryClient = useQueryClient();
  const { mutate: registerComuna, isPending } = useRegisterComuna();
  const { data: parroquias = [] } = useParroquias();

  const [formData, setFormData] = useState({
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
    consejosComunales: [] as SelectOption[],
    titularesFinanzas: [] as SelectOption[],
    fechaUltimaEleccion: "",
    parroquiaId: 0,
    cantidadConsejosComunales: 0,
    poblacionVotante: 0,
  });

  const [titularesFinanzasOptions, setTitularesFinanzasOptions] = useState<SelectOption[]>([]);

  const parroquiasData = queryClient.getQueryData<Parroquia[]>(["parroquias"]);
  const consejosComunalesData = queryClient.getQueryData<ConsejoComunal[]>(["consejoscomunal"]);

  const parroquiasOptions: ParroquiaOption[] = parroquiasData?.map((parroquia) => ({
    value: Number(parroquia.id),
    label: parroquia.nombre,
  })) || [];

  const consejosComunalesOptions: SelectOption[] = consejosComunalesData
    ?.filter((cc) => !cc.comunaId || cc.comunaId === null || cc.comunaId === "")
    .map((cc) => ({
     value: cc.id,
     label: cc.cc, // cc.cc es el nombre o identificador visible
     })) || [];

  useEffect(() => {
    if (!consejosComunalesData || formData.consejosComunales.length === 0) {
      setTitularesFinanzasOptions([]);
      setFormData(prev => ({ ...prev, titularesFinanzas: [] }));
      return;
    }

    const selectedCcIds = formData.consejosComunales.map(cc => cc.value);
    const uniqueVoceros = new Map();

    consejosComunalesData
      .filter(cc => selectedCcIds.includes(cc.id))
      .forEach(cc => {
        cc.titularesFinanzas?.forEach((persona) => {
          if (persona.id && !uniqueVoceros.has(persona.id)) {
            uniqueVoceros.set(persona.id, {
              value: persona.id.toString(),
              label: `${persona.nombres} ${persona.apellidos} - CI: ${persona.ci}`,
            });
          }
        });
      });

    setTitularesFinanzasOptions(Array.from(uniqueVoceros.values()));
    
    setFormData(prev => {
      const currentSelection = prev.titularesFinanzas.filter(banco => uniqueVoceros.has(Number(banco.value)));
      return { ...prev, titularesFinanzas: currentSelection };
    });
  }, [formData.consejosComunales, consejosComunalesData]);

  const handleParroquiaChange = (selectedOption: any) => {
    setFormData({ ...formData, parroquiaId: selectedOption ? Number(selectedOption.value) : 0 });
  };

  const handleConsejosChange = (newValue: MultiValue<SelectOption>) => {
    setFormData({ ...formData, consejosComunales: [...newValue] });
  };

  const handleTitularesFinanzasChange = (newValue: MultiValue<SelectOption>) => {
    if (newValue.length <= 11) {
      setFormData({ ...formData, titularesFinanzas: [...newValue] });
    } else {
      toast.error("La Unidad de Gestión Financiera solo puede tener hasta 11 miembros.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number = value;

    if (name === "numComisionPromotora") {
      newValue = value.replace(/[^0-9]/g, '');
    }

    if (name === "cuentaBancaria") {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 20);
    }

    if (name === "rif") {
      let cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const letterMatch = cleaned.match(/^[A-Z]/);
      const letter = letterMatch ? letterMatch[0] : '';

      if (letter) {
        let numbers = cleaned.substring(letter.length).replace(/[^0-9]/g, '');
        numbers = numbers.slice(0, 9);
        let formattedValue = letter;
        
        if (numbers.length > 0) {
          formattedValue += '-' + numbers.slice(0, 8);
        }
        if (numbers.length > 8) {
          formattedValue += '-' + numbers.slice(8, 9);
        }
        newValue = formattedValue;
      } else {
        newValue = cleaned;
      }
    }

    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "number" ? Number(newValue) : newValue,
    }));
  }; 
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { 
      rif, 
      cuentaBancaria, 
      consejosComunales, 
      titularesFinanzas,
      parroquiaId,
      fechaComisionPromotora,
      fechaRegistro,
      fechaUltimaEleccion 
    } = formData;
    
    const requiredFields = [
      "codigo", "numComisionPromotora", "fechaComisionPromotora", "rif", "cuentaBancaria", 
      "fechaRegistro", "nombre", "direccion", "linderoNorte", "linderoSur", 
      "linderoEste", "linderoOeste", "fechaUltimaEleccion"
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`El campo "${field}" es obligatorio.`);
        return;
      }
    }

    if (parroquiaId === 0) {
      toast.error("Debe seleccionar una Parroquia.");
      return;
    }

    const rifRegex = /^[A-Z]-\d{8}-\d{1}$/;
    if (!rifRegex.test(rif)) {
      toast.error("El RIF debe tener el formato: Letra-8 dígitos-1 dígito (Ej: J-12345678-9).");
      return;
    }

    if (/[^0-9]/.test(cuentaBancaria) || cuentaBancaria.length !== 20) {
      toast.error("El número de cuenta solo debe contener dígitos y tener exactamente 20 caracteres.");
      return;
    }

    if (consejosComunales.length < 2) {
      toast.error("Una Comuna debe estar integrada por al menos 2 Consejos Comunales.");
      return;
    }

    if (titularesFinanzas.length < 10) {
      toast.error("El Banco de la Comuna debe tener un mínimo de 10 miembros.");
      return;
    }
    if (titularesFinanzas.length > 11) {
      toast.error("El Banco de la Comuna solo puede tener un máximo de 11 miembros.");
      return;
    }

    const fechaCP = new Date(fechaComisionPromotora);
    const fechaR = new Date(fechaRegistro);
    const fechaUE = new Date(fechaUltimaEleccion);

    if (fechaR < fechaCP) {
      toast.error("La Fecha de Registro no puede ser anterior a la Fecha de Comisión Promotora.");
      return;
    }
    if (fechaUE < fechaCP) {
      toast.error("La Fecha de Última Elección no puede ser anterior a la Fecha de Comisión Promotora.");
      return;
    }

    const consejosMapeados = consejosComunales.map((cc) => cc.value);
    const titularesMapeados = titularesFinanzas.map((titular) => titular.value);

    const payload = {
      ...formData,
      parroquiaId: parroquiaId,
      cantidadConsejosComunales: consejosMapeados.length,
      poblacionVotante: Number(formData.poblacionVotante),
      consejosComunales: consejosMapeados,
      titularesFinanzas: titularesMapeados,
    };
    
    registerComuna(payload);
  };

  return (
    <div className="animate-fade-in opacity-0 mx-auto my-1 max-w-[95%] px-8 py-6 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <Tittle title={"Registrar Nueva Comuna"} />
      
      <form onSubmit={handleSubmit} className="pt-6 px-6 space-y-8">
        
        <section>
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">📝 Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput label="Nombre de la Comuna" id="nombre" value={formData.nombre} onChange={handleChange} required />
            <FormInput label="Código SITUR" id="codigo" value={formData.codigo} onChange={handleChange} required />
            <FormInput label="RIF (Ej: C-12345678-9)" id="rif" value={formData.rif} onChange={handleChange} required />
            <FormInput label="N° Comisión Promotora" id="numComisionPromotora" value={formData.numComisionPromotora} onChange={handleChange} required />
            <FormInput label="Cuenta Bancaria (20 dígitos)" id="cuentaBancaria" value={formData.cuentaBancaria} onChange={handleChange} required />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">📅 Fechas Legales</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput type="date" label="Fecha Comisión Promotora" id="fechaComisionPromotora" value={formData.fechaComisionPromotora} onChange={handleChange} required />
            <FormInput type="date" label="Fecha de Registro" id="fechaRegistro" value={formData.fechaRegistro} onChange={handleChange} required />
            <FormInput type="date" label="Fecha Última Elección" id="fechaUltimaEleccion" value={formData.fechaUltimaEleccion} onChange={handleChange} required />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">📍 Ubicación Geográfica y Linderos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="parroquia" className="block text-sm mb-1">Parroquia</label>
              <Select
                id="parroquia"
                name="parroquiaId"
                options={parroquiasOptions}
                placeholder="Seleccionar Parroquia"
                onChange={handleParroquiaChange}
                value={parroquiasOptions.find(option => option.value === formData.parroquiaId) || null}
              />
            </div>
            <FormInput textarea label="Dirección Detallada" id="direccion" value={formData.direccion} onChange={handleChange} required />
            <FormInput label="Lindero Norte" id="linderoNorte" value={formData.linderoNorte} onChange={handleChange} required />
            <FormInput label="Lindero Sur" id="linderoSur" value={formData.linderoSur} onChange={handleChange} required />
            <FormInput label="Lindero Este" id="linderoEste" value={formData.linderoEste} onChange={handleChange} required />
            <FormInput label="Lindero Oeste" id="linderoOeste" value={formData.linderoOeste} onChange={handleChange} required />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">🔗💰 Integración de Consejos Comunales y Banco de la Comuna</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="consejosComunales" className="block text-sm mb-1">C.C. que integran la Comuna (Mínimo 2)</label>
              <Select
                id="consejosComunales"
                name="consejosComunales"
                options={consejosComunalesOptions}
                isMulti
                placeholder="Selecciona los Consejos Comunales"
                onChange={handleConsejosChange}
                value={formData.consejosComunales}
              />
            </div>
            <div>
              <label htmlFor="titularesFinanzas" className="block text-sm mb-1">Banco de la comuna (Min 10, Max 11)</label>
              <Select
                id="titularesFinanzas"
                name="titularesFinanzas"
                options={titularesFinanzasOptions}
                isMulti
                placeholder="Selecciona los miembros"
                onChange={handleTitularesFinanzasChange}
                value={formData.titularesFinanzas}
                isDisabled={formData.consejosComunales.length === 0}
              />
            </div>
          </div>
        </section>
        
        <div className="flex justify-center pt-6">
          <Button 
            onClick={handleSubmit} 
            title={isPending ? "Registrando..." : "Registrar Comuna"}
            disabled={isPending} 
          />
        </div>
      </form>
    </div>
  );
};
    
export default RegisterComunaPage;