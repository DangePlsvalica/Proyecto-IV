/*
  Warnings:

  - A unique constraint covering the columns `[situr]` on the table `ConsejoComunal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ConsejoComunal" ADD COLUMN     "situr" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ConsejoComunal_situr_key" ON "ConsejoComunal"("situr");
