/*
  Warnings:

  - You are about to drop the column `parroquiaId` on the `Vehiculo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vehiculo" DROP CONSTRAINT "Vehiculo_parroquiaId_fkey";

-- AlterTable
ALTER TABLE "Vehiculo" DROP COLUMN "parroquiaId";
