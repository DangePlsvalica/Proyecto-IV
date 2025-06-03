"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateRole } from "@/hooks/useCreateRole";
import Loading from "@/components/Loading";

const ALL_ROUTES = [
  { path: "/admin-user", label: "Administrar usuarios" },
  { path: "/admin-role", label: "Administrar roles" },
  { path: "/personas", label: "Personas" },
  { path: "/comunas", label: " Comunas" },
  { path: "/consejos-comunales", label: "Consejos Comunales" },
  { path: "/gestor-de-proyectos", label: "Proyectos" },
  { path: "/register", label: "Registro" },
  { path: "/vehiculos", label: "Vehículos" }
];

const NewRole = () => {
  const [name, setName] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const { createRole, error, isLoading, resetError } = useCreateRole();
  const router = useRouter();


  const handleCheckboxChange = (route: string) => {
    setSelectedRoutes(prev =>
      prev.includes(route) ? prev.filter(r => r !== route) : [...prev, route]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      resetError();

      try {
        await createRole({ name, routes: selectedRoutes });
        router.push("/admin-role");
      } catch (err) {}
    };

    if (isLoading) return <Loading />;

 return (
    <div className="animate-fade-in max-w-xl mx-auto mt-10 p-10 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-4">Crear Nuevo Rol</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Nombre del Rol</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="mt-1 block w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Modulos Permitidos</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_ROUTES.map(({ path, label }) => (
              <label key={path} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedRoutes.includes(path)}
                  onChange={() => handleCheckboxChange(path)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full border border-black justify-center rounded-md bg-sky-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creando..." : "Crear Rol"}
        </button>
      </form>
    </div>
  );
};

export default NewRole;