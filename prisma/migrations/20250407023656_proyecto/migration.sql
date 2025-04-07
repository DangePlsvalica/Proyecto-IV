-- CreateTable
CREATE TABLE "Proyecto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL,
    "ultimaActividad" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT NOT NULL,
    "comuna" TEXT NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proyecto_nombre_key" ON "Proyecto"("nombre");
