import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Divider from '../../components/Divider';
import { MdOutlineSearch } from "react-icons/md";

const comunas = async () => {
  const session = await getServerSession(authOptions);
  console.log("Estado de la sesión:", session);
  if (!session) {
    // Redirige al usuario si no está autenticado
    redirect("/");
  }
  return (
    <>
    <div className="flex flex-col items-start justify-between pl-6 py-3">
      <h1 className="text-xl max-[500px]:text-xl">Comunas</h1>
    </div>
    <Divider />
    <div className="flex justify-between px-6 py-4">
    <form className="flex items-center gap-3">
      <MdOutlineSearch />
      <input
        type="text"
        placeholder="Buscar por nombre de proyecto"
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
        <th>ESTADO</th>
        <th>MUNUCIPIO</th>
        <th>PARROQUIA</th>
        <th>CC</th>
        <th>RIF</th>
        <th>Nro DE CUENTA</th>
        <th>FECHA DE CONSTITUCIÓN</th>
        <th>FECHA DE VENCIMIENTO</th>
        <th>VOCERO</th>
        <th>POBLACIÓN VOTANTE</th>
      </thead>
      <tbody className="text-[14px]">
        <tr className="border-b">
          <td>Yaracuy</td>
          <td>Bruzual</td>
          <td>Campoelias</td>
          <td>11/03/2025</td>
          <td>2547189</td>
          <td>010254895265984</td>
          <td>10/03/2024</td>
          <td>11/03/2025</td>
          <td>10/03/2025</td>
          <td>Este es un proyecto de agua</td>
        </tr>
        <tr className="border-b">
          <td>Yaracuy</td>
          <td>Bruzual</td>
          <td>Campoelias</td>
          <td>11/03/2025</td>
          <td>2547189</td>
          <td>010254895265984</td>
          <td>10/03/2025</td>
          <td>11/03/2025</td>
          <td>10/03/2025</td>
          <td>Este es un proyecto de luz</td>
        </tr>
        <tr className="border-b">
          <td>Yaracuy</td>
          <td>Bruzual</td>
          <td>Campoelias</td>
          <td>11/03/2025</td>
          <td>2547189</td>
          <td>010254895265984</td>
          <td>10/03/2025</td>
          <td>11/03/2025</td>
          <td>10/03/2025</td>
          <td>Este es un proyecto de carretera</td>
        </tr>
        <tr className="border-b">
          <td>Yaracuy</td>
          <td>Bruzual</td>
          <td>Campoelias</td>
          <td>11/03/2025</td>
          <td>2547189</td>
          <td>010254895265984</td>
          <td>10/03/2025</td>
          <td>11/03/2025</td>
          <td>10/03/2025</td>
          <td>Este es un proyecto de casas</td>
        </tr>
      </tbody>
    </table>
    </div>
    </>
  );
};

export default comunas;
