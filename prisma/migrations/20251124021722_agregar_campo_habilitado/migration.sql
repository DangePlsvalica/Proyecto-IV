/*
  Warnings:

  - You are about to drop the column `poblacionVotante` on the `Comuna` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comuna" DROP COLUMN "poblacionVotante";

-- AlterTable
ALTER TABLE "Persona" ADD COLUMN     "habilitado" BOOLEAN NOT NULL DEFAULT true;
