import { useCallback } from "react";

const useGenerarActaPDF = () => {
  const generarPDF = useCallback(async (comuna: any) => {
    try {
      const response = await fetch("/api/acta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comuna }),
      });

      if (!response.ok) {
        throw new Error("Error generando el PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("No se pudo generar el acta PDF.");
    }
  }, []);

  return generarPDF;
};

export default useGenerarActaPDF;
