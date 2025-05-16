/*
  Warnings:

  - You are about to drop the column `parroquia` on the `Comuna` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comuna" DROP COLUMN "parroquia",
ADD COLUMN     "parroquiaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Comuna" ADD CONSTRAINT "Comuna_parroquiaId_fkey" FOREIGN KEY ("parroquiaId") REFERENCES "Parroquia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
