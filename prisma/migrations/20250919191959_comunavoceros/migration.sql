/*
  Warnings:

  - You are about to drop the column `ciVocero` on the `Comuna` table. All the data in the column will be lost.
  - You are about to drop the column `nombreVocero` on the `Comuna` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `Comuna` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comuna" DROP COLUMN "ciVocero",
DROP COLUMN "nombreVocero",
DROP COLUMN "telefono";

-- AlterTable
ALTER TABLE "Persona" ADD COLUMN     "comunaId" TEXT;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_comunaId_fkey" FOREIGN KEY ("comunaId") REFERENCES "Comuna"("id") ON DELETE SET NULL ON UPDATE CASCADE;
