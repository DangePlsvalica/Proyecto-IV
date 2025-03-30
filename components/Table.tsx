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
    <div className="max-w-[100%] px-16">
      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full table-auto rounded-2xl bg-sky-200" >
          <thead className={`text-[14px] text-center border-b border-sky-600 ${thClassName}`}>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className={`px-4 border-r min-w-[175px] border-sky-600 ${thClassName}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {data.map((item, index) => (
              <tr key={index} className="border-b border-sky-600">
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
