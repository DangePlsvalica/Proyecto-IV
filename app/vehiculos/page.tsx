"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Divider from "../../components/Divider";
import SearchForm from "../../components/SearchForm";
import Loading from "@/components/Loading";
import Tittle from '@/components/Tittle';
import Button from "@/components/Button";
import {useVehiculos} from "@/hooks/useVehiculos";
import { IoIosCar } from "react-icons/io";

const Vehiculos: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: vehiculosData, isLoading } = useVehiculos();

  const filteredData = vehiculosData
    ? vehiculosData.filter((vehiculo) =>
        Object.values(vehiculo)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  if (isLoading) {
    return ( <Loading /> );
  }

  return (
    <>
      <Tittle title={"Vehículos"} />
      <Divider />
      <div className="animate-fade-in opacity-0 flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />    
          <Button
            onClick={() => router.push("/vehiculos/register-vehiculo")}
            title={"Registrar nuevo vehículo"}
          />
      </div>
      <div className="animate-fade-in grid grid-cols-3 md:grid-cols-3 2xl:grid-cols-4 gap-6 px-6">
        {filteredData.map((vehiculo) => (
          <div
            key={vehiculo.id}
            className="bg-white rounded-2xl max-w-[400px] shadow-md overflow-hidden border border-sky-900 hover:shadow-2xl transition-all duration-300 p-4 flex flex-col justify-between"
          >
            <div className="text-sky-950 text-[14px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">{vehiculo.placa}</h2>
                <IoIosCar size={30} className="text-sky-800" />
                </div>
              <p><span className="font-semibold">Clase:</span> {vehiculo.clase}</p>
              <p><span className="font-semibold">Consejo Comunal:</span> {vehiculo.cc}</p>
              <p><span className="font-semibold">Comuna:</span> {vehiculo.comuna}</p>
              <p><span className="font-semibold">Marca:</span> {vehiculo.marca}</p>
              <p><span className="font-semibold">Modelo:</span> {vehiculo.modelo}</p>
              <p><span className="font-semibold">Estatus:</span> {vehiculo.estatus}</p>
              <p><span className="font-semibold">Persona asignada:</span> {vehiculo.voceroAsignado}</p>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                title="Ver más detalles"
                onClick={() => router.push(`/vehiculos/${vehiculo.id}`)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Vehiculos;