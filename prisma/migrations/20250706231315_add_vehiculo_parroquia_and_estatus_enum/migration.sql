/*
  Warnings:

  - You are about to drop the column `municipio` on the `Vehiculo` table. All the data in the column will be lost.
  - The `estatus` column on the `Vehiculo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VehiculoStatus" AS ENUM ('asignado', 'reasignado', 'extraviado', 'devuelto_a_caracas', 'inactivo');

-- AlterTable
ALTER TABLE "Vehiculo" DROP COLUMN "municipio",
ADD COLUMN     "parroquiaId" INTEGER,
DROP COLUMN "estatus",
ADD COLUMN     "estatus" "VehiculoStatus" NOT NULL DEFAULT 'asignado';

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_parroquiaId_fkey" FOREIGN KEY ("parroquiaId") REFERENCES "Parroquia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
