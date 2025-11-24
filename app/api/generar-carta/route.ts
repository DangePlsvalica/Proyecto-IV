import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createReport } from "docx-templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📦 Datos recibidos:", body);

    // ✅ Extraemos la info de la comuna que llega desde el frontend
    const { nombre, honor, fechaReferendo, debilidades, oportunidades, historia, comuna } = body;

    // 📄 Datos combinados
    const data = {
      nombre,
      honor,
      fechaReferendo,
      debilidades,
      oportunidades,
      historia,
      estado: comuna?.parroquiaRelation?.estado || "No definido",
      municipio: comuna?.parroquiaRelation?.municipio || "No definido",
      parroquia: comuna?.parroquiaRelation?.nombre || "No definido",
      codigo: comuna?.codigo || "",
      direccion: comuna?.direccion || "",
      linderoNorte: comuna?.linderoNorte || "",
      linderoSur: comuna?.linderoSur || "",
      linderoEste: comuna?.linderoEste || "",
      linderoOeste: comuna?.linderoOeste || "",
    };

    // 🧩 Ruta de la plantilla
    const templatePath = path.join(process.cwd(), "public", "plantillas", "CartaFundacional_template.docx");
    const template = new Uint8Array(fs.readFileSync(templatePath));

    // ⚙️ Generar el documento con delimitadores {{ }}
    const buffer = await createReport({
      template,
      data,
      cmdDelimiter: ["{{", "}}"],
    });

    // 📤 Devolver el archivo listo para descargar
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="CartaFundacional_${nombre || "Comuna"}.docx"`,
      },
    });
  } catch (err) {
    console.error("❌ Error al generar carta:", err);
    return NextResponse.json({ error: "No se pudo generar la carta" }, { status: 500 });
  }
}
