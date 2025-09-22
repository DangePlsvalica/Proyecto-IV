import * as XLSX from "xlsx";

interface ExportExcelProps {
  headers: string[];
  data: (string | number)[][];
  filename: string;
  sheetName?: string;
}

const exportToExcel = ({ headers, data, filename, sheetName = "Sheet1" }: ExportExcelProps) => {
  // Agregar encabezados
  const worksheetData = [headers, ...data];

  // Crear worksheet y workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Descargar archivo
  XLSX.writeFile(workbook, filename);
};

export default exportToExcel;
