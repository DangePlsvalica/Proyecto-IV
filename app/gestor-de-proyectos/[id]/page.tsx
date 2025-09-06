"use client";
import { useParams, notFound } from "next/navigation";
import useProyectos from "@/hooks/useProyectos";
import { FieldDisplay } from "@/components/FieldDisplay";
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import Loading from "@/components/Loading";

const ViewProyectoPage = () => {
  const { id } = useParams();
  const { data: proyectosData, isLoading } = useProyectos();

  if (isLoading) return <Loading />;

  // Convertimos el id de params a número
  const proyecto = proyectosData?.find((p) => p.id === id);
  if (!proyecto) notFound();

  return (
    <div className="mx-auto my-1 max-w-[95%] px-14 py-8 border border-sky-200 rounded-xl bg-[#f8f8f8]">
      <h1 className="text-2xl font-bold mb-6 text-sky-950">
        Detalles del Proyecto
      </h1>

      {/* Información Básica */}
      <div>
        <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">
          Información Básica
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <FieldDisplay label="Consulta" value={proyecto.consulta} />
          <FieldDisplay label="Nombre del Proyecto" value={proyecto.nombreProyecto} />
          <FieldDisplay label="Código del Proyecto" value={proyecto.codigoProyecto} />
          <FieldDisplay label="Estatus" value={proyecto.estatusProyecto} />
          <FieldDisplay label="Categoría" value={proyecto.categoria} />
        </div>
      </div>

      {/* Ubicación y Consejo Comunal */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-sky-900 mb-4 border-b pb-2">
          Ubicación y Consejo Comunal
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <FieldDisplay label="Estado" value={proyecto.consejoComunal?.parroquiaRelation?.estado} />
          <FieldDisplay label="Municipio" value={proyecto.consejoComunal?.parroquiaRelation?.municipio} />
          <FieldDisplay label="Parroquia" value={proyecto.consejoComunal?.parroquiaRelation?.nombre} />
          <FieldDisplay label="Comuna" value={proyecto.consejoComunal?.comuna?.nombre} />
          <FieldDisplay label="Código SITUR Comuna" value={proyecto.consejoComunal?.comuna?.codigo} />
          <FieldDisplay label="Consejo Comunal" value={proyecto.consejoComunal?.cc} />
          <FieldDisplay label="Código SITUR Consejo Comunal" value={proyecto.consejoComunal?.situr} />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-center pt-6 gap-4">
        <Button title="Editar" href={`/gestor-de-proyectos/${id}/edit`} />
        <DeleteButton
          onClick={() => {}}
          isPending={false}
          label="Eliminar proyecto"
        />
      </div>
    </div>
  );
};

export default ViewProyectoPage;
