'use client';

import React, { useState, useEffect } from "react";
import Divider from '../../components/Divider';
import { MdOutlineSearch } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Define el tipo de los datos para ConsejoComunal
interface ConsejoComunal {
  id: string; // Asegúrate de que coincida con el esquema en la base de datos
  estado: string;
  municipio: string;
  parroquia: string;
  cc: string; // Nombre del Consejo Comunal
  rif: string;
  numeroCuenta: string;
  fechaConstitucion: string; // Podría ser Date si quieres manejar objetos de fecha directamente
  fechaVencimiento: string; // Podría ser Date si es necesario
  vocero: string;
  tlfVocero: string;
  poblacionVotante: number; // Cantidad de población votante
}

const ConsejosComunales: React.FC = () => {
  const { data: session, status } = useSession();
    const router = useRouter();
  
    // Redirige al login si no hay sesión y la autenticación está cargada
    if (status === "loading") {
      return <p>Cargando...</p>; // Muestra un indicador de carga mientras se verifica la sesión
    }
  
    if (!session) {
      router.push("/login"); // Redirige al login si no hay sesión
      return null; // Asegura que la página no se renderice
    }
  // Estado para almacenar los datos de la base de datos
  const [consejosData, setConsejosData] = useState<ConsejoComunal[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Hook para obtener los datos desde la API
  useEffect(() => {
    const fetchConsejos = async () => {
      try {
        const response = await fetch("/api/consejos");
        const data: ConsejoComunal[] = await response.json();
        console.log("Datos de consejos:", data);
        setConsejosData(data); // Almacena los datos obtenidos
      } catch (error) {
        console.error("Error fetching consejos comunales:", error);
      }
    };
    fetchConsejos();
  }, []);

  // Filtra los datos según el término de búsqueda
  const filteredData = consejosData.filter((consejo) =>
    Object.values(consejo)
      .join(" ") // Combina todos los valores de un objeto en una cadena
      .toLowerCase() // Convierte todo a minúsculas para comparación insensible a mayúsculas
      .includes(searchTerm.toLowerCase()) // Compara con el término de búsqueda
  );

  return (
    <>
      <div className="flex flex-col items-start justify-between pl-6 py-3">
        <h1 className="text-xl max-[500px]:text-xl">Consejos Comunales</h1>
      </div>
      <Divider />
      <div className="flex justify-between px-6 py-4">
        <form className="flex items-center gap-3" onSubmit={(e) => e.preventDefault()}>
          <MdOutlineSearch />
          <input
            type="text"
            placeholder="Buscar por nombre de proyecto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[320px] h-[32px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            type="submit"
            className="border px-3 h-[32px] text-[15px] font-semibold bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Buscar
          </button>
        </form>
      </div>
      <div className="px-6">
        <table className="w-full">
          <thead className="text-[14px] text-left border-b">
            <tr>
              <th>ESTADO</th>
              <th>MUNICIPIO</th>
              <th>PARROQUIA</th>
              <th>CC</th>
              <th>RIF</th>
              <th>Nro DE CUENTA</th>
              <th>FECHA DE CONSTITUCIÓN</th>
              <th>FECHA DE VENCIMIENTO</th>
              <th>VOCERO</th>
              <th>TELEFONO DEL VOCERO</th>
              <th>POBLACION VOTANTE</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {filteredData.map((consejo) => (
              <tr key={consejo.id} className="border-b">
                <td>{consejo.estado}</td>
                <td>{consejo.municipio}</td>
                <td>{consejo.parroquia}</td>
                <td>{consejo.cc}</td>
                <td>{consejo.rif}</td>
                <td>{consejo.numeroCuenta}</td>
                <td>{consejo.fechaConstitucion}</td>
                <td>{consejo.fechaVencimiento}</td>
                <td>{consejo.vocero}</td>
                <td>{consejo.tlfVocero}</td>
                <td>{consejo.poblacionVotante}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ConsejosComunales;

