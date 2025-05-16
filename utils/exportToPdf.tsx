import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportPDFProps {
  headers: string[];
  data: any[];
  filename: string;
  title?: string;
}

const exportToPDF = ({ headers, data, filename, title }: ExportPDFProps) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "A3" });

  if (title) {
    doc.setFontSize(18);
    doc.text(title, 40, 50);
  }

  const maxColumnWidth = 60; // Define el ancho máximo para las columnas

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 70,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 7
    },
    styles: {
      overflow: 'linebreak',
      cellWidth: 'wrap', // Ajusta el contenido para que se ajuste en la celda
    },
    // Establecer el máximo ancho de las columnas en columnStyles
    columnStyles: headers.reduce((acc, header, index) => {
      acc[index] = {
        cellWidth: maxColumnWidth,
      };
      return acc;
    }, {} as any),
    pageBreak: 'auto'
  });

  doc.save(filename);
};

export default exportToPDF;
