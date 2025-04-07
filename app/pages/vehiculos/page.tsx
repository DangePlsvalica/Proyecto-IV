"use client";
import React, { useState } from "react";
import Divider from "../../../components/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchForm from "../../../components/SearchForm";
import Table from "../../../components/Table";
import Button from "@/components/Button";
import { Vehiculo } from "@/hooks/interfaces/vehiculo.interface";
import Loading from "@/components/Loading";
import Tittle from '@/components/Tittle'
import useVehiculos from "@/hooks/useVehiculos";

const Vehiculos: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Hook para obtener datos desde la API
  const { data: vehiculosData, isLoading } = useVehiculos();

  // Filtra datos según el término de búsqueda
  const filteredData = vehiculosData
    ? vehiculosData.filter((vehiculo) =>
      Object.values(vehiculo)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    : [];

  // Encabezados de la tabla
  const headers = [
    "Placa",
    "Clase",
    "Consejo Comunal",
    "Comuna",
    "Marca",
    "Modelo",
    "Color",
    "Anio",
    "Municipio",
    "Serial de la Carroceria",
    "Vocero Asignado",
    "Fecha de Entrega",
    "Estatus",
  ];
  const tdClassName = "border-b border-r border-sky-950";
  // Renderiza cada fila
  const renderRow = (vehiculo: Vehiculo) => {
    return (
      <>
        <td className={tdClassName}>{vehiculo.placa}</td>
        <td className={tdClassName}>{vehiculo.clase}</td>
        <td className={tdClassName}>{vehiculo.cc}</td>
        <td className={tdClassName}>{vehiculo.comuna}</td>
        <td className={tdClassName}>{vehiculo.marca}</td>
        <td className={tdClassName}>{vehiculo.modelo}</td>
        <td className={tdClassName}>{vehiculo.color}</td>
        <td className={tdClassName}>{vehiculo.ano}</td>
        <td className={tdClassName}>{vehiculo.municipio}</td>
        <td className={tdClassName}>{vehiculo.serialCarroceria}</td>
        <td className={tdClassName}>{vehiculo.voceroAsignado}</td>
        <td className={tdClassName}>
          {new Date(vehiculo.fechaDeEntrega).toLocaleDateString()}
        </td>
        <td className={tdClassName}>{vehiculo.estatus}</td>
      </>
    );
  };

  if (status === "loading") {
    return (<Loading />);
  }
  if (!session) {
    router.push("/pages/login");
    return null;
  }
  if (isLoading) {
    return (<Loading />);
  }

  return (
    <>
      <Tittle title={"Vehiculos"} />
      <Divider />
      <div className="flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button onClick={() => router.push("/register-comuna")} title={"Registrar nuevo vehiculo"}></Button>
      </div>
      <Table
        headers={headers}
        data={filteredData}
        renderRow={renderRow}
        thClassName="text-center border-b border-sky-600"
        tdClassName="text-left border-r border-sky-600"
      />
    </>
  );
};

export default Vehiculos;
