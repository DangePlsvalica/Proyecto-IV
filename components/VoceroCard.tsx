type Persona = {
  nombres?: string;
  apellidos?: string;
  ci?: string;
  telefono?: string;
};

interface VoceroCardProps {
  titulo: string;
  titular?: Persona;
  suplente?: Persona;
}

const VoceroCard = ({ titulo, titular, suplente }: VoceroCardProps) => (
  <div className="border p-4 rounded bg-white shadow-sm">
    <p className="font-bold text-sky-800">{titulo}</p>

    {titular && (
      <>
        <p className="text-sm pt-2">Titular: {titular.nombres} {titular.apellidos}</p>
        <p className="text-sm">Cédula: {titular.ci}</p>
        <p className="text-sm border-b-2 pb-2">Teléfono: {titular.telefono}</p>
      </>
    )}

    {suplente && (
      <>
        <p className="text-sm pt-2">Suplente: {suplente.nombres} {suplente.apellidos}</p>
        <p className="text-sm">Cédula: {suplente.ci}</p>
        <p className="text-sm">Teléfono: {suplente.telefono}</p>
      </>
    )}

    {!suplente && (
      <p className="text-sm pt-2">Suplente: No asignado</p>
    )}
  </div>
);

export default VoceroCard;
