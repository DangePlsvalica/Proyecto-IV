import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import { readFile } from 'fs/promises';

export async function POST(req: Request) {
  try {
    const { comuna } = await req.json();

    const templatePath = path.resolve(process.cwd(), 'public/plantilla_acta_comuna.pdf');
    const existingPdfBytes = new Uint8Array(await readFile(templatePath));

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // Rellenar campos del PDF
    form.getTextField("nombre").setText(comuna.nombre || "");
    form.getTextField("codigo").setText(comuna.codigo || "");
    form.getTextField("rif").setText(comuna.rif || "");
    form.getTextField("cuentaBancaria").setText(comuna.cuentaBancaria || "");
    form.getTextField("direccion").setText(comuna.direccion || "");
    form.getTextField("municipio").setText(comuna.parroquiaRelation?.municipio || "");
    form.getTextField("parroquia").setText(comuna.parroquiaRelation?.nombre || "");
    form.getTextField("fechaRegistro").setText(
      comuna.fechaRegistro ? new Date(comuna.fechaRegistro).toLocaleDateString() : ""
    );
    form.getTextField("numComisionPromotora").setText(comuna.numComisionPromotora || "");
    form.getTextField("fechaComisionPromotora").setText(
      comuna.fechaComisionPromotora ? new Date(comuna.fechaComisionPromotora).toLocaleDateString() : ""
    );
    form.getTextField("fechaUltimaEleccion").setText(
      comuna.fechaUltimaEleccion ? new Date(comuna.fechaUltimaEleccion).toLocaleDateString() : ""
    );
    form.getTextField("poblacionVotante").setText(
      comuna.poblacionVotante?.toLocaleString() || ""
    );

    // Consejos comunales como lista con viñetas
    const consejosLista = comuna.consejosComunales
      ?.map((cc: { cc: string }) => `• ${cc.cc}`)
      .join('\n') || "";
    form.getTextField("consejosComunales").setText(consejosLista);

    form.flatten(); // Hace el PDF no editable

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="acta_comuna.pdf"',
      },
    });
  } catch (err) {
    console.error("Error generando PDF:", err);
    return NextResponse.json({ error: "Error generando acta PDF" }, { status: 500 });
  }
}
