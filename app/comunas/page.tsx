'use client';

import React, { useState, useEffect } from "react";
import Divider from '../../components/Divider';
import { MdOutlineSearch } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchForm from '../../components/SearchForm';
import Table from '../../components/Table';

// Define el tipo de los datos para Comuna
interface Comuna {
  id: string; 
  codigo: string; 
  numComisionPromotora: string; 
  fechaComisionPromotora: string; 
  rif: string; 
  cuentaBancaria: string; 
  fechaRegistro: string; 
  nombre: string; 
  direccion: string; 
  linderoNorte: string; 
  linderoSur: string; 
  linderoEste: string; 
  linderoOeste: string; 
  consejoComunal: string; // JSON en formato string
  fechaUltimaEleccion: string; 
  municipio: string; 
  parroquia: string; 
  nombreVocero: string; 
  ciVocero: string; 
  telefono: string; 
  cantidadConsejosComunales: number; 
  poblacionVotante: number; 
}

const ConsejosComunales: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Manejo de sesión y redirección
  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  // Estado para almacenar datos
  const [comunasData, setComunasData] = useState<Comuna[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Hook para obtener datos desde la API
  useEffect(() => {
    const fetchComunas = async () => {
      try {
        const response = await fetch("/api/comunas", { method: "GET" });
        const data: Comuna[] = await response.json();
        console.log("Datos de comunas:", data);
        setComunasData(data);
      } catch (error) {
        console.error("Error fetching comunas:", error);
      }
    };
    fetchComunas();
  }, []);

  // Filtra datos según el término de búsqueda
  const filteredData = comunasData.filter((comuna) =>
    Object.values(comuna)
      .join(" ") 
      .toLowerCase() 
      .includes(searchTerm.toLowerCase()) 
  );

  // Encabezados de la tabla
  const headers = [
    "Codigo", 
    "N° comisión promotora", 
    "Fecha de comisión promotora", 
    "RIF", 
    "Cuenta Bancaria", 
    "Fecha de Registro de la Comuna", 
    "Nombre de la Comuna", 
    "Dirección de la Comuna", 
    "Lindero Norte", 
    "Lindero Sur", 
    "Lindero Este", 
    "Lindero Oeste", 
    "C.C que integra la Comuna", 
    "Fecha de Última Elección", 
    "Municipio", 
    "Parroquia", 
    "Nombre y Apellidos del Vocero", 
    "C.I", 
    "Telefono", 
    "Cantidad de C.C que integra la Comuna", 
    "Población Votante"
  ];

  // Renderiza cada fila
  const renderRow = (comuna: Comuna, tdClassName: string) => {
    let consejosArray: string[] = []; // Inicializa como array vacío

    try {
      // Procesa consejoComunal como array si es válido
      consejosArray = JSON.parse(comuna.consejoComunal);
    } catch (error) {
      console.error("Error parsing consejoComunal:", error);
    }

    return (
      <>
        <td className={`pl-4 ${tdClassName}`}>{comuna.codigo}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.numComisionPromotora}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.fechaComisionPromotora}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.rif}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.cuentaBancaria}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.fechaRegistro}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.nombre}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.direccion}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.linderoNorte}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.linderoSur}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.linderoEste}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.linderoOeste}</td>
        <td className={`pl-2 ${tdClassName}`}>
          {/* Renderiza cada consejo comunal como lista */}
          <ol className="list-decimal list-inside">
            {consejosArray.map((consejo, index) => (
              <li key={index}>{consejo}</li>
            ))}
          </ol>
        </td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.fechaUltimaEleccion}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.municipio}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.parroquia}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.nombreVocero}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.ciVocero}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.telefono}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.cantidadConsejosComunales}</td>
        <td className={`pl-2 ${tdClassName}`}>{comuna.poblacionVotante}</td>
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col items-start justify-between pl-6 py-3">
        <h1 className="text-xl max-[500px]:text-xl">Comunas</h1>
      </div>
      <Divider />
      <div className="flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button
          type="button"
          onClick={() => router.push("/register-comuna")}
          className="border h-[32px] text-[15px] px-3 font-medium bg-green-700 text-white rounded-md hover:bg-green-800 focus:outline-none"
        >
          Registrar nueva comuna
        </button>
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

export default ConsejosComunales;

