/*
  Warnings:

  - You are about to drop the column `categoria` on the `Proyecto` table. All the data in the column will be lost.
  - You are about to drop the column `consulta` on the `Proyecto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Proyecto" DROP COLUMN "categoria",
DROP COLUMN "consulta",
ADD COLUMN     "categoriaId" TEXT,
ADD COLUMN     "consultaId" TEXT;

-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
