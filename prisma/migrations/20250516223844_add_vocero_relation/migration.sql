/*
  Warnings:

  - You are about to drop the column `estado` on the `ConsejoComunal` table. All the data in the column will be lost.
  - You are about to drop the column `municipio` on the `ConsejoComunal` table. All the data in the column will be lost.
  - You are about to drop the column `parroquia` on the `ConsejoComunal` table. All the data in the column will be lost.
  - You are about to drop the column `tlfVocero` on the `ConsejoComunal` table. All the data in the column will be lost.
  - You are about to drop the column `vocero` on the `ConsejoComunal` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voceroId]` on the table `ConsejoComunal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ConsejoComunal" DROP COLUMN "estado",
DROP COLUMN "municipio",
DROP COLUMN "parroquia",
DROP COLUMN "tlfVocero",
DROP COLUMN "vocero",
ADD COLUMN     "parroquiaId" INTEGER,
ADD COLUMN     "voceroId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "role",
ADD COLUMN     "roleId" TEXT;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "routes" TEXT[],

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "juridica" BOOLEAN NOT NULL,
    "ci" INTEGER,
    "rif" TEXT,
    "telefono" INTEGER NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ConsejoComunal_voceroId_key" ON "ConsejoComunal"("voceroId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsejoComunal" ADD CONSTRAINT "ConsejoComunal_parroquiaId_fkey" FOREIGN KEY ("parroquiaId") REFERENCES "Parroquia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsejoComunal" ADD CONSTRAINT "ConsejoComunal_voceroId_fkey" FOREIGN KEY ("voceroId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;
