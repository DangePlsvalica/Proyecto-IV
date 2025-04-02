import React from 'react';

interface TableProps {
  headers: string[]; // Cabeceras de la tabla
  data: any[]; // Datos de la tabla
  renderRow: (item: any, tdClassName: string) => React.ReactNode; // Función para renderizar cada fila
  thClassName?: string; // Clases adicionales para las cabeceras
  tdClassName?: string; // Clases adicionales para las celdas
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  renderRow,
  thClassName = '',
  tdClassName = ''
}) => {
  return (
    <div className="max-w-[100%] px-6">
      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full table-auto rounded-2xl border-separate border-spacing-0 border border-sky-950" >
          <thead className={`text-[14px] text-center border-b border-white ${thClassName}`}>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className={`leading-snug px-4 py-1 text-white border-r min-w-[175px] border-b bg-sky-950 border-sky-950 ${thClassName}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[14px] text-center">
            {data.map((item, index) => (
              <tr key={index}>
                {renderRow(item, tdClassName)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
