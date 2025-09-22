/*
  Warnings:

  - You are about to drop the column `comisionElectoralId` on the `ConsejoComunal` table. All the data in the column will be lost.
  - You are about to drop the column `contraloriaId` on the `ConsejoComunal` table. All the data in the column will be lost.
  - You are about to drop the column `finanzasId` on the `ConsejoComunal` table. All the data in the column will be lost.
  - You are about to drop the column `suplenteComisionElectoralId` on the `ConsejoComunal` table. All the data in the column will be lost.
  - You are about to drop the column `suplenteContraloriaId` on the `ConsejoComunal` table. All the data in the column will be lost.
  - You are about to drop the column `suplenteFinanzasId` on the `ConsejoComunal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConsejoComunal" DROP CONSTRAINT "ConsejoComunal_comisionElectoralId_fkey";

-- DropForeignKey
ALTER TABLE "ConsejoComunal" DROP CONSTRAINT "ConsejoComunal_contraloriaId_fkey";

-- DropForeignKey
ALTER TABLE "ConsejoComunal" DROP CONSTRAINT "ConsejoComunal_finanzasId_fkey";

-- DropForeignKey
ALTER TABLE "ConsejoComunal" DROP CONSTRAINT "ConsejoComunal_suplenteComisionElectoralId_fkey";

-- DropForeignKey
ALTER TABLE "ConsejoComunal" DROP CONSTRAINT "ConsejoComunal_suplenteContraloriaId_fkey";

-- DropForeignKey
ALTER TABLE "ConsejoComunal" DROP CONSTRAINT "ConsejoComunal_suplenteFinanzasId_fkey";

-- DropIndex
DROP INDEX "ConsejoComunal_comisionElectoralId_key";

-- DropIndex
DROP INDEX "ConsejoComunal_contraloriaId_key";

-- DropIndex
DROP INDEX "ConsejoComunal_finanzasId_key";

-- DropIndex
DROP INDEX "ConsejoComunal_suplenteComisionElectoralId_key";

-- DropIndex
DROP INDEX "ConsejoComunal_suplenteContraloriaId_key";

-- DropIndex
DROP INDEX "ConsejoComunal_suplenteFinanzasId_key";

-- AlterTable
ALTER TABLE "ConsejoComunal" DROP COLUMN "comisionElectoralId",
DROP COLUMN "contraloriaId",
DROP COLUMN "finanzasId",
DROP COLUMN "suplenteComisionElectoralId",
DROP COLUMN "suplenteContraloriaId",
DROP COLUMN "suplenteFinanzasId";

-- CreateTable
CREATE TABLE "_TitularesComisionElectoral" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TitularesComisionElectoral_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SuplentesComisionElectoral" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SuplentesComisionElectoral_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TitularesContraloria" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TitularesContraloria_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SuplentesContraloria" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SuplentesContraloria_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TitularesFinanzas" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TitularesFinanzas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SuplentesFinanzas" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SuplentesFinanzas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TitularesComisionElectoral_B_index" ON "_TitularesComisionElectoral"("B");

-- CreateIndex
CREATE INDEX "_SuplentesComisionElectoral_B_index" ON "_SuplentesComisionElectoral"("B");

-- CreateIndex
CREATE INDEX "_TitularesContraloria_B_index" ON "_TitularesContraloria"("B");

-- CreateIndex
CREATE INDEX "_SuplentesContraloria_B_index" ON "_SuplentesContraloria"("B");

-- CreateIndex
CREATE INDEX "_TitularesFinanzas_B_index" ON "_TitularesFinanzas"("B");

-- CreateIndex
CREATE INDEX "_SuplentesFinanzas_B_index" ON "_SuplentesFinanzas"("B");

-- AddForeignKey
ALTER TABLE "_TitularesComisionElectoral" ADD CONSTRAINT "_TitularesComisionElectoral_A_fkey" FOREIGN KEY ("A") REFERENCES "ConsejoComunal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TitularesComisionElectoral" ADD CONSTRAINT "_TitularesComisionElectoral_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SuplentesComisionElectoral" ADD CONSTRAINT "_SuplentesComisionElectoral_A_fkey" FOREIGN KEY ("A") REFERENCES "ConsejoComunal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SuplentesComisionElectoral" ADD CONSTRAINT "_SuplentesComisionElectoral_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TitularesContraloria" ADD CONSTRAINT "_TitularesContraloria_A_fkey" FOREIGN KEY ("A") REFERENCES "ConsejoComunal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TitularesContraloria" ADD CONSTRAINT "_TitularesContraloria_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SuplentesContraloria" ADD CONSTRAINT "_SuplentesContraloria_A_fkey" FOREIGN KEY ("A") REFERENCES "ConsejoComunal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SuplentesContraloria" ADD CONSTRAINT "_SuplentesContraloria_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TitularesFinanzas" ADD CONSTRAINT "_TitularesFinanzas_A_fkey" FOREIGN KEY ("A") REFERENCES "ConsejoComunal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TitularesFinanzas" ADD CONSTRAINT "_TitularesFinanzas_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SuplentesFinanzas" ADD CONSTRAINT "_SuplentesFinanzas_A_fkey" FOREIGN KEY ("A") REFERENCES "ConsejoComunal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SuplentesFinanzas" ADD CONSTRAINT "_SuplentesFinanzas_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;
