export default function useGenerarCartaFundacional() {
  const generarCarta = async (comuna: any, formData: any) => {
    try {
      const res = await fetch("/api/generar-carta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre: comuna.nombre,
            honor: formData.honor,
            fechaReferendo: formData.fechaReferendo,
            debilidades: formData.debilidades,
            oportunidades: formData.oportunidades,
            historia: formData.historia,
            comuna, // 👈 esto es lo nuevo
            }),
      });

      if (!res.ok) throw new Error("Error en la respuesta del servidor");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CartaFundacional_${comuna.nombre}.docx`;
      a.click();
    } catch (err) {
      alert("Error al generar la carta fundacional: " + err);
    }
  };

  return { generarCarta };
}