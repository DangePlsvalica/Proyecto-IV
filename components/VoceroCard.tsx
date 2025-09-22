type Persona = {
  nombres?: string;
  apellidos?: string;
  ci?: string;
  telefono?: string;
};

type VoceroData = Persona | Persona[] | undefined;

interface VoceroCardProps {
  titulo: string;
  titular?: VoceroData;
  suplente?: VoceroData;
}

const VoceroCard = ({ titulo, titular, suplente }: VoceroCardProps) => {

  const renderPersona = (persona: Persona) => (
    <div className="text-sm">
      <p>{persona.nombres} {persona.apellidos}</p>
      {persona.ci && <p>Cédula: {persona.ci}</p>}
      {persona.telefono && <p>Teléfono: {persona.telefono}</p>}
    </div>
  );

  return (
    <div className="border p-4 rounded bg-white shadow-sm">
      <p className="font-bold text-sky-800">{titulo}</p>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Columna de Titulares */}
        <div className="border-r pr-4">
          <p className="text-sm font-semibold">Titulares:</p>
          <div className="max-h-[340px] overflow-y-auto">
            {titular ? (
              Array.isArray(titular) ? (
                titular.length > 0 ? (
                  titular.map((persona, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      {renderPersona(persona)}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No asignado</p>
                )
              ) : (
                renderPersona(titular)
              )
            ) : (
              <p className="text-sm text-gray-500">No asignado</p>
            )}
          </div>
        </div>

        {/* Columna de Suplentes */}
        <div className="pl-1">
          <p className="text-sm font-semibold">Suplentes:</p>
          <div className="max-h-[340px] overflow-y-auto">
            {suplente ? (
              Array.isArray(suplente) ? (
                suplente.length > 0 ? (
                  suplente.map((persona, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      {renderPersona(persona)}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No asignado</p>
                )
              ) : (
                renderPersona(suplente)
              )
            ) : (
              <p className="text-sm text-gray-500">No asignado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoceroCard;