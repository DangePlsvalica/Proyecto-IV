/*
  Warnings:

  - Changed the type of `fechaComisionPromotora` on the `Comuna` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fechaRegistro` on the `Comuna` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fechaUltimaEleccion` on the `Comuna` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fechaConstitucion` on the `ConsejoComunal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fechaVencimiento` on the `ConsejoComunal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Comuna" DROP COLUMN "fechaComisionPromotora",
ADD COLUMN     "fechaComisionPromotora" TIMESTAMP(3) NOT NULL,
DROP COLUMN "fechaRegistro",
ADD COLUMN     "fechaRegistro" TIMESTAMP(3) NOT NULL,
DROP COLUMN "fechaUltimaEleccion",
ADD COLUMN     "fechaUltimaEleccion" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ConsejoComunal" DROP COLUMN "fechaConstitucion",
ADD COLUMN     "fechaConstitucion" TIMESTAMP(3) NOT NULL,
DROP COLUMN "fechaVencimiento",
ADD COLUMN     "fechaVencimiento" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" SERIAL NOT NULL,
    "placa" TEXT NOT NULL,
    "clase" TEXT NOT NULL,
    "cc" TEXT NOT NULL,
    "comuna" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "municipio" TEXT NOT NULL,
    "serialCarroceria" TEXT NOT NULL,
    "voceroAsignado" TEXT NOT NULL,
    "fechaDeEntrega" TIMESTAMP(3) NOT NULL,
    "estatus" TEXT NOT NULL,
    "observacionArchivo" TEXT,
    "observacion" TEXT,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);
