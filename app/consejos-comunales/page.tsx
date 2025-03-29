'use client';
import React, { useState } from "react";
import Divider from '../../components/Divider';
import { MdOutlineSearch } from "react-icons/md";

const ConsejosComunales = () => {
  // Array de datos
  const consejosData = [
    {
      estado: "Yaracuy",
      municipio: "Bruzual",
      parroquia: "Campoelias",
      cc: "11/03/2025",
      rif: "2547189",
      cuenta: "010254895265984",
      fechaConstitucion: "10/03/2024",
      fechaVencimiento: "11/03/2025",
      vocero: "10/03/2025",
      proyecto: "Este es un proyecto de agua",
    },
    {
      estado: "Yaracuy",
      municipio: "Bruzual",
      parroquia: "Campoelias",
      cc: "11/03/2025",
      rif: "2547189",
      cuenta: "010254895265984",
      fechaConstitucion: "10/03/2025",
      fechaVencimiento: "11/03/2025",
      vocero: "10/03/2025",
      proyecto: "Este es un proyecto de luz",
    },
    {
      estado: "Yaracuy",
      municipio: "Bruzual",
      parroquia: "Campoelias",
      cc: "11/03/2025",
      rif: "2547189",
      cuenta: "010254895265984",
      fechaConstitucion: "10/03/2025",
      fechaVencimiento: "11/03/2025",
      vocero: "Maria",
      proyecto: "Este es un proyecto de carretera",
    },
    {
      estado: "Yaracuy",
      municipio: "Bruzual",
      parroquia: "Campoelias",
      cc: "11/03/2025",
      rif: "2547189",
      cuenta: "010254895265984",
      fechaConstitucion: "10/03/2025",
      fechaVencimiento: "11/03/2025",
      vocero: "Juan",
      proyecto: "Este es un proyecto de casas",
    },
  ];

  // Estado para el texto de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra los datos según el término de búsqueda
  const filteredData = consejosData.filter((consejo) =>
    Object.values(consejo)
      .join(" ") // Combina todos los valores de un objeto en una cadena
      .toLowerCase() // Convierte todo a minúsculas para una comparación más precisa
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
            value={searchTerm} // Vincula el estado con el valor del input
            onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado al escribir
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
              <th>PROYECTO</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {filteredData.map((consejo, index) => (
              <tr key={index} className="border-b">
                <td>{consejo.estado}</td>
                <td>{consejo.municipio}</td>
                <td>{consejo.parroquia}</td>
                <td>{consejo.cc}</td>
                <td>{consejo.rif}</td>
                <td>{consejo.cuenta}</td>
                <td>{consejo.fechaConstitucion}</td>
                <td>{consejo.fechaVencimiento}</td>
                <td>{consejo.vocero}</td>
                <td>{consejo.proyecto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ConsejosComunales;
