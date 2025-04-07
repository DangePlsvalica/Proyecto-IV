"use client";
import React, { useState, useEffect } from "react";
import Divider from "../../components/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SearchForm from "../../components/SearchForm";
import Table from "../../components/Table";
import Image from "next/image";
import Button from "@/components/Button";


// Define el tipo de los datos para Comuna
interface Comuna {
  id: string;
  codigo: string;
  numComisionPromotora: string;
  fechaComisionPromotora: Date;
  rif: string;
  cuentaBancaria: string;
  fechaRegistro: Date;
  nombre: string;
  direccion: string;
  linderoNorte: string;
  linderoSur: string;
  linderoEste: string;
  linderoOeste: string;
  consejoComunal: string; // JSON en formato string
  fechaUltimaEleccion: Date;
  municipio: string;
  parroquia: string;
  nombreVocero: string;
  ciVocero: string;
  telefono: string;
  cantidadConsejosComunales: number;
  poblacionVotante: number;
}

const Comunas: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Estado para almacenar datos
  const [comunasData, setComunasData] = useState<Comuna[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Hook para obtener datos desde la API
  useEffect(() => {
    const fetchComunas = async () => {
      try {
        setIsLoading(true); // Activar animacion de carga
        const response = await fetch("/api/comunas", { method: "GET" });
        const data: Comuna[] = await response.json();
        console.log("Datos de comunas:", data);
        setComunasData(data);
      } catch (error) {
        console.error("Error fetching comunas:", error);
      } finally {
        setIsLoading(false); // Desactivar animacion de carga
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
    "Población Votante",
  ];
const tdClassName = "border-b border-r border-sky-950";
  // Renderiza cada fila
  const renderRow = (comuna: Comuna) => {
    let consejosArray: string[] = []; // Inicializa como array vacío

    try {
      // Procesa consejoComunal como array si es válido
      consejosArray = JSON.parse(comuna.consejoComunal);
    } catch (error) {
      console.error("Error parsing consejoComunal:", error);
    }

    return (
      <>
        <td className={tdClassName}>{comuna.codigo}</td>
        <td className={tdClassName}>{comuna.numComisionPromotora}</td>
        <td className={tdClassName}>
          {new Date(comuna.fechaComisionPromotora).toLocaleDateString()}
        </td>
        <td className={tdClassName}>{comuna.rif}</td>
        <td className={tdClassName}>{comuna.cuentaBancaria}</td>
        <td className={tdClassName}>
          {new Date(comuna.fechaRegistro).toLocaleDateString()}
        </td>
        <td className={tdClassName}>{comuna.nombre}</td>
        <td className={tdClassName}>{comuna.direccion}</td>
        <td className={tdClassName}>{comuna.linderoNorte}</td>
        <td className={tdClassName}>{comuna.linderoSur}</td>
        <td className={tdClassName}>{comuna.linderoEste}</td>
        <td className={tdClassName}>{comuna.linderoOeste}</td>
        <td className={tdClassName}>
          {/* Renderiza cada consejo comunal como lista */}
          <ol className="list-decimal list-inside">
            {consejosArray.map((consejo, index) => (
              <li key={index}>{consejo}</li>
            ))}
          </ol>
        </td>
        <td className={tdClassName}>
          {new Date(comuna.fechaUltimaEleccion).toLocaleDateString()}
        </td>
        <td className={tdClassName}>{comuna.municipio}</td>
        <td className={tdClassName}>{comuna.parroquia}</td>
        <td className={tdClassName}>{comuna.nombreVocero}</td>
        <td className={tdClassName}>{comuna.ciVocero}</td>
        <td className={tdClassName}>{comuna.telefono}</td>
        <td className={tdClassName}>
          {comuna.cantidadConsejosComunales}
        </td>
        <td className={tdClassName}>{comuna.poblacionVotante}</td>
      </>
    );
  };
  // Manejo de sesión y redirección
  if (status === "loading") {
    return <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-12">
          <div className="flex flex-col md:flex-row items-center gap-8 w-24 max-w-6xl mx-auto justify-center">
                <Image
                  src="/espera.gif"
                  width={100}
                  height={100}
                  alt="espera gif"
                  className="rounded-3xl"
                />
      </div>
      </main>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }
  return (
    <>
      <div className="flex flex-col items-start justify-between pl-6 py-3">
        <h1 className="text-xl max-[500px]:text-xl">Comunas</h1>
      </div>
      <Divider />
      <div className="flex justify-between px-6 py-4">
        <SearchForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button onClick={() => router.push("/register-comuna")} title={"Registrar nueva comuna"}></Button>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
                    <Image
                      src="/espera.gif"
                      width={100}
                      height={100}
                      alt="espera gif"
                      className="rounded-3xl"
                    />
        </div>
      ) : (
        <Table
          headers={headers}
          data={filteredData}
          renderRow={renderRow}
          thClassName="text-center border-b border-sky-600"
          tdClassName="text-left border-r border-sky-600"
        />
      )}
    </>
  );
};

export default Comunas;
