/*
  Warnings:

  - A unique constraint covering the columns `[cc]` on the table `ConsejoComunal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Vehiculo" ALTER COLUMN "cc" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ConsejoComunal_cc_key" ON "ConsejoComunal"("cc");

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_cc_fkey" FOREIGN KEY ("cc") REFERENCES "ConsejoComunal"("cc") ON DELETE SET NULL ON UPDATE CASCADE;
