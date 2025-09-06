/*
  Warnings:

  - You are about to drop the column `comuna` on the `Proyecto` table. All the data in the column will be lost.
  - You are about to drop the column `fechaCreacion` on the `Proyecto` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Proyecto` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Proyecto` table. All the data in the column will be lost.
  - You are about to drop the column `ultimaActividad` on the `Proyecto` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codigoProyecto]` on the table `Proyecto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `circuito` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoProyecto` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consejoComunalId` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consulta` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estatusProyecto` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreProyecto` to the `Proyecto` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Proyecto_nombre_key";

-- AlterTable
ALTER TABLE "Proyecto" DROP COLUMN "comuna",
DROP COLUMN "fechaCreacion",
DROP COLUMN "nombre",
DROP COLUMN "status",
DROP COLUMN "ultimaActividad",
ADD COLUMN     "circuito" TEXT NOT NULL,
ADD COLUMN     "codigoProyecto" TEXT NOT NULL,
ADD COLUMN     "consejoComunalId" TEXT NOT NULL,
ADD COLUMN     "consulta" INTEGER NOT NULL,
ADD COLUMN     "estatusProyecto" TEXT NOT NULL,
ADD COLUMN     "nombreProyecto" TEXT NOT NULL,
ADD COLUMN     "observacion" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Proyecto_codigoProyecto_key" ON "Proyecto"("codigoProyecto");

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_consejoComunalId_fkey" FOREIGN KEY ("consejoComunalId") REFERENCES "ConsejoComunal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
