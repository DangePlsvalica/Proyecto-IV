import React, { useState } from 'react';

interface TableProps {
  headers: string[]; // Cabeceras de la tabla
  data: any[];
  renderRow: (item: any, tdClassName: string) => React.ReactNode; // Función para renderizar cada fila
  thClassName?: string; 
  tdClassName?: string; 
  onSelectionChange?: (selectedItems: any[]) => void;
  onRowClick?: (item: any) => void;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  renderRow,
  thClassName = '',
  tdClassName = '',
  onSelectionChange,
  onRowClick,
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIndexes = new Set(data.map((_, index) => index));
      setSelectedRows(allIndexes);
      onSelectionChange?.(data); // Pasa todos los datos seleccionados
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (index: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(Array.from(newSelectedRows).map((i) => data[i]));
  };

  const isAllSelected = selectedRows.size === data.length && data.length > 0;

    // Manejador click fila, evitamos click cuando se da en checkbox (e.target es input)
  const handleRowClick = (e: React.MouseEvent, item: any) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') {
      // No hacer nada si el click es en checkbox
      return;
    }
    onRowClick?.(item);
  };

  return (
    <div className="animate-fade-in opacity-0 max-w-[100%] px-6">
      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full table-auto rounded-2xl border-separate border-spacing-0 border border-sky-950">
          <thead className={`text-[14px] text-center border-b border-white ${thClassName}`}>
            <tr>
              <th className="leading-snug px-2 py-1 border-r min-w-[50px] border-b bg-sky-950 border-sky-950">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-3 h-3 cursor-pointer"
                />
              </th>
              {headers.map((header, index) => (
                <th key={index} className={`leading-snug px-4 py-1 text-white border-r min-w-[175px] border-b bg-sky-950 border-sky-950 ${thClassName}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[14px] text-center">
            {data.map((item, index) => (
              <tr key={index} onClick={(e) => handleRowClick(e, item)} className="cursor-pointer hover:bg-sky-100">
                <td className="p-0 border-b max-w-[10px] border-sky-950">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(index)}
                    onChange={() => handleSelectRow(index)}
                    className="w-3 h-3 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
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

