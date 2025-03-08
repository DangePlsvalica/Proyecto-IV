/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('Activo', 'Inactivo', 'Bloqueado');

-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('Formativo', 'Agricola', 'ConsultaPopular');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Comuna" (
    "codigo_situr" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "municipio" VARCHAR(100) NOT NULL,
    "parroquia" VARCHAR(100) NOT NULL,
    "lindero_norte" TEXT,
    "lindero_sur" TEXT,
    "lindero_este" TEXT,
    "lindero_oeste" TEXT,

    CONSTRAINT "Comuna_pkey" PRIMARY KEY ("codigo_situr")
);

-- CreateTable
CREATE TABLE "ConsejoComunal" (
    "codigo_situr" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "fecha_eleccion" TIMESTAMP(3) NOT NULL,
    "poblacion_total" INTEGER NOT NULL,
    "cant_hombres" INTEGER NOT NULL,
    "cant_mujeres" INTEGER NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "codigo_situr_comuna" VARCHAR(20) NOT NULL,

    CONSTRAINT "ConsejoComunal_pkey" PRIMARY KEY ("codigo_situr")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "correo" VARCHAR(100) NOT NULL,
    "contraseña" CHAR(60) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimo_acceso" TIMESTAMP(3),
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'Activo',
    "codigo_situr_consejo" VARCHAR(20),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("correo")
);

-- CreateTable
CREATE TABLE "Proyecto" (
    "id_proyecto" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "estatus" VARCHAR(50) NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "comentarios" TEXT,
    "votos" INTEGER NOT NULL DEFAULT 0,
    "codigo_situr_comuna" VARCHAR(20) NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id_proyecto")
);

-- CreateTable
CREATE TABLE "InventarioCarros" (
    "placa" VARCHAR(15) NOT NULL,
    "marca" VARCHAR(50) NOT NULL,
    "modelo" VARCHAR(50) NOT NULL,
    "color" VARCHAR(30),
    "anio" INTEGER NOT NULL,
    "serial_carroceria" VARCHAR(50) NOT NULL,
    "estatus" VARCHAR(50) NOT NULL,
    "codigo_situr_consejo" VARCHAR(20) NOT NULL,

    CONSTRAINT "InventarioCarros_pkey" PRIMARY KEY ("placa")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id_evento" SERIAL NOT NULL,
    "tipo" "TipoEvento" NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "estado" VARCHAR(50) NOT NULL,
    "comentarios" TEXT,
    "codigo_situr_comuna" VARCHAR(20) NOT NULL,
    "id_proyecto" INTEGER,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "Vocero" (
    "cedula" VARCHAR(15) NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "cargo" VARCHAR(100) NOT NULL,
    "codigo_situr_consejo" VARCHAR(20) NOT NULL,

    CONSTRAINT "Vocero_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "Observacion" (
    "id_observacion" SERIAL NOT NULL,
    "fecha_entrega" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asignacion" VARCHAR(100) NOT NULL,
    "sistema_cargo" VARCHAR(100) NOT NULL,
    "id_proyecto" INTEGER NOT NULL,

    CONSTRAINT "Observacion_pkey" PRIMARY KEY ("id_observacion")
);

-- CreateTable
CREATE TABLE "ActividadEconomica" (
    "codigo" VARCHAR(20) NOT NULL,
    "nombre_ospc" VARCHAR(200) NOT NULL,
    "tipo_actividad" VARCHAR(100) NOT NULL,
    "codigo_situr_comuna" VARCHAR(20) NOT NULL,

    CONSTRAINT "ActividadEconomica_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "ProyectoVotacion" (
    "id_proyecto" INTEGER NOT NULL,
    "codigo_situr_consejo" VARCHAR(20) NOT NULL,

    CONSTRAINT "ProyectoVotacion_pkey" PRIMARY KEY ("id_proyecto","codigo_situr_consejo")
);

-- CreateIndex
CREATE UNIQUE INDEX "InventarioCarros_serial_carroceria_key" ON "InventarioCarros"("serial_carroceria");

-- AddForeignKey
ALTER TABLE "ConsejoComunal" ADD CONSTRAINT "ConsejoComunal_codigo_situr_comuna_fkey" FOREIGN KEY ("codigo_situr_comuna") REFERENCES "Comuna"("codigo_situr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_codigo_situr_consejo_fkey" FOREIGN KEY ("codigo_situr_consejo") REFERENCES "ConsejoComunal"("codigo_situr") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proyecto" ADD CONSTRAINT "Proyecto_codigo_situr_comuna_fkey" FOREIGN KEY ("codigo_situr_comuna") REFERENCES "Comuna"("codigo_situr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventarioCarros" ADD CONSTRAINT "InventarioCarros_codigo_situr_consejo_fkey" FOREIGN KEY ("codigo_situr_consejo") REFERENCES "ConsejoComunal"("codigo_situr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_codigo_situr_comuna_fkey" FOREIGN KEY ("codigo_situr_comuna") REFERENCES "Comuna"("codigo_situr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto"("id_proyecto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vocero" ADD CONSTRAINT "Vocero_codigo_situr_consejo_fkey" FOREIGN KEY ("codigo_situr_consejo") REFERENCES "ConsejoComunal"("codigo_situr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observacion" ADD CONSTRAINT "Observacion_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto"("id_proyecto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadEconomica" ADD CONSTRAINT "ActividadEconomica_codigo_situr_comuna_fkey" FOREIGN KEY ("codigo_situr_comuna") REFERENCES "Comuna"("codigo_situr") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoVotacion" ADD CONSTRAINT "ProyectoVotacion_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "Proyecto"("id_proyecto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProyectoVotacion" ADD CONSTRAINT "ProyectoVotacion_codigo_situr_consejo_fkey" FOREIGN KEY ("codigo_situr_consejo") REFERENCES "ConsejoComunal"("codigo_situr") ON DELETE RESTRICT ON UPDATE CASCADE;
