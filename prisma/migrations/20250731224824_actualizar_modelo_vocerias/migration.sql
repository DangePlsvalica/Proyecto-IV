/*
  Warnings:

  - A unique constraint covering the columns `[comisionElectoralId]` on the table `ConsejoComunal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[suplenteComisionElectoralId]` on the table `ConsejoComunal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contraloriaId]` on the table `ConsejoComunal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[suplenteContraloriaId]` on the table `ConsejoComunal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[finanzasId]` on the table `ConsejoComunal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[suplenteFinanzasId]` on the table `ConsejoComunal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ConsejoComunal" ADD COLUMN     "comisionElectoralId" INTEGER,
ADD COLUMN     "contraloriaId" INTEGER,
ADD COLUMN     "finanzasId" INTEGER,
ADD COLUMN     "suplenteComisionElectoralId" INTEGER,
ADD COLUMN     "suplenteContraloriaId" INTEGER,
ADD COLUMN     "suplenteFinanzasId" INTEGER;

-- CreateTable
CREATE TABLE "CategoriaVoceria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "CategoriaVoceria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoVoceria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "esObligatoria" BOOLEAN NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "TipoVoceria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voceria" (
    "id" SERIAL NOT NULL,
    "ccId" TEXT NOT NULL,
    "tipoVoceriaId" INTEGER NOT NULL,
    "titularId" INTEGER NOT NULL,
    "suplenteId" INTEGER,

    CONSTRAINT "Voceria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaVoceria_nombre_key" ON "CategoriaVoceria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "TipoVoceria_nombre_key" ON "TipoVoceria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Voceria_titularId_key" ON "Voceria"("titularId");

-- CreateIndex
CREATE UNIQUE INDEX "Voceria_suplenteId_key" ON "Voceria"("suplenteId");

-- CreateIndex
CREATE UNIQUE INDEX "Voceria_ccId_tipoVoceriaId_key" ON "Voceria"("ccId", "tipoVoceriaId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsejoComunal_comisionElectoralId_key" ON "ConsejoComunal"("comisionElectoralId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsejoComunal_suplenteComisionElectoralId_key" ON "ConsejoComunal"("suplenteComisionElectoralId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsejoComunal_contraloriaId_key" ON "ConsejoComunal"("contraloriaId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsejoComunal_suplenteContraloriaId_key" ON "ConsejoComunal"("suplenteContraloriaId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsejoComunal_finanzasId_key" ON "ConsejoComunal"("finanzasId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsejoComunal_suplenteFinanzasId_key" ON "ConsejoComunal"("suplenteFinanzasId");

-- AddForeignKey
ALTER TABLE "ConsejoComunal" ADD CONSTRAINT "ConsejoComunal_comisionElectoralId_fkey" FOREIGN KEY ("comisionElectoralId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsejoComunal" ADD CONSTRAINT "ConsejoComunal_suplenteComisionElectoralId_fkey" FOREIGN KEY ("suplenteComisionElectoralId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsejoComunal" ADD CONSTRAINT "ConsejoComunal_contraloriaId_fkey" FOREIGN KEY ("contraloriaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsejoComunal" ADD CONSTRAINT "ConsejoComunal_suplenteContraloriaId_fkey" FOREIGN KEY ("suplenteContraloriaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsejoComunal" ADD CONSTRAINT "ConsejoComunal_finanzasId_fkey" FOREIGN KEY ("finanzasId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsejoComunal" ADD CONSTRAINT "ConsejoComunal_suplenteFinanzasId_fkey" FOREIGN KEY ("suplenteFinanzasId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipoVoceria" ADD CONSTRAINT "TipoVoceria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaVoceria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voceria" ADD CONSTRAINT "Voceria_ccId_fkey" FOREIGN KEY ("ccId") REFERENCES "ConsejoComunal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voceria" ADD CONSTRAINT "Voceria_tipoVoceriaId_fkey" FOREIGN KEY ("tipoVoceriaId") REFERENCES "TipoVoceria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voceria" ADD CONSTRAINT "Voceria_titularId_fkey" FOREIGN KEY ("titularId") REFERENCES "Persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voceria" ADD CONSTRAINT "Voceria_suplenteId_fkey" FOREIGN KEY ("suplenteId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;
