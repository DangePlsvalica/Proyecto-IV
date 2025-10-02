-- CreateEnum
CREATE TYPE "TipoImpacto" AS ENUM ('ALTO_RENDIMIENTO', 'NORMAL', 'BAJO_IMPACTO');

-- AlterTable
ALTER TABLE "Proyecto" ADD COLUMN     "impacto" "TipoImpacto";
