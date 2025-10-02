/*
  Warnings:

  - You are about to drop the column `circuito` on the `Proyecto` table. All the data in the column will be lost.
  - Added the required column `comunidadesBeneficiadas` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `familiasBeneficiadas` to the `Proyecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personasBeneficiadas` to the `Proyecto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proyecto" DROP COLUMN "circuito",
ADD COLUMN     "comunidadesBeneficiadas" INTEGER NOT NULL,
ADD COLUMN     "familiasBeneficiadas" INTEGER NOT NULL,
ADD COLUMN     "personasBeneficiadas" INTEGER NOT NULL,
ALTER COLUMN "consulta" SET DATA TYPE TEXT;
