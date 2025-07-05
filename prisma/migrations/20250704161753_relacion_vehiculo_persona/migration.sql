/*
  Warnings:

  - You are about to drop the column `juridica` on the `Persona` table. All the data in the column will be lost.
  - You are about to drop the column `rif` on the `Persona` table. All the data in the column will be lost.
  - You are about to drop the column `voceroAsignado` on the `Vehiculo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voceroAsignadoId]` on the table `Vehiculo` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ci` on table `Persona` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Persona" DROP COLUMN "juridica",
DROP COLUMN "rif",
ALTER COLUMN "ci" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vehiculo" DROP COLUMN "voceroAsignado",
ADD COLUMN     "voceroAsignadoId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_voceroAsignadoId_key" ON "Vehiculo"("voceroAsignadoId");

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_voceroAsignadoId_fkey" FOREIGN KEY ("voceroAsignadoId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;
