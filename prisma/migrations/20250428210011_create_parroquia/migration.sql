/*
  Warnings:

  - You are about to drop the column `consejoComunal` on the `Comuna` table. All the data in the column will be lost.
  - Added the required column `comunaId` to the `ConsejoComunal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comuna" DROP COLUMN "consejoComunal";

-- AlterTable
ALTER TABLE "ConsejoComunal" ADD COLUMN     "comunaId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Parroquia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Yaracuy',

    CONSTRAINT "Parroquia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConsejoComunal" ADD CONSTRAINT "ConsejoComunal_comunaId_fkey" FOREIGN KEY ("comunaId") REFERENCES "Comuna"("id") ON DELETE SET NULL ON UPDATE CASCADE;
