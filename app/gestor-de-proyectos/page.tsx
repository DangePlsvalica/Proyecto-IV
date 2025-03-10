import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Divider from '../../components/Divider';
import { MdOutlineSearch } from "react-icons/md";

const Dashboard = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  return (
    <>
    <div className="flex flex-col items-start justify-between pl-6 py-3">
      <h1 className="text-xl max-[500px]:text-xl">Proyectos</h1>
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
    <button
        type="submit"
        className="border h-[32px] text-[15px] px-3 font-medium bg-green-700 text-white rounded-md hover:bg-green-800 focus:outline-none"
      >
        + Proyecto
    </button>
    </div>
    <div className="px-6">
    <table className="w-full">
      <thead className="text-[14px] text-left border-b">
        <th>ID</th>
        <th>NOMBRE</th>
        <th>ESTADO</th>
        <th>CREADO EN</th>
        <th>ULTIMA ACTIVIDAD EN</th>
        <th>DESCRIPCION</th>
      </thead>
      <tbody className="text-[14px]">
        <tr className="border-b">
          <td>1</td>
          <td>Agua</td>
          <td>NO EMPEZADO</td>
          <td>10/03/2025</td>
          <td>11/03/2025</td>
          <td>Este es un proyecto de agua</td>
        </tr>
        <tr className="border-b">
        <td>2</td>
          <td>Luz</td>
          <td>TERMINADO</td>
          <td>25/02/2025</td>
          <td>07/03/2025</td>
          <td>Este es un proyecto de luz</td>
        </tr>
        <tr className="border-b">
        <td>3</td>
          <td>CARRETERA</td>
          <td>NO EMPEZADO</td>
          <td>08/01/2025</td>
          <td>28/02/2025</td>
          <td>Este es un proyecto de carretera</td>
        </tr>
        <tr className="border-b">
        <td>4</td>
          <td>Casas</td>
          <td>TERMINADO</td>
          <td>15/01/2025</td>
          <td>03/03/2025</td>
          <td>Este es un proyecto de casas</td>
        </tr>
      </tbody>
    </table>
    </div>
    </>
  );
};

export default Dashboard;
