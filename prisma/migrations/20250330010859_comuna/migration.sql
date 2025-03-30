-- CreateTable
CREATE TABLE "Comuna" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "numComisionPromotora" TEXT NOT NULL,
    "fechaComisionPromotora" TEXT NOT NULL,
    "rif" TEXT NOT NULL,
    "cuentaBancaria" TEXT NOT NULL,
    "fechaRegistro" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "linderoNorte" TEXT NOT NULL,
    "linderoSur" TEXT NOT NULL,
    "linderoEste" TEXT NOT NULL,
    "linderoOeste" TEXT NOT NULL,
    "consejoComunal" TEXT NOT NULL,
    "fechaUltimaEleccion" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "parroquia" TEXT NOT NULL,
    "nombreVocero" TEXT NOT NULL,
    "ciVocero" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "cantidadConsejosComunales" INTEGER NOT NULL,
    "poblacionVotante" INTEGER NOT NULL,

    CONSTRAINT "Comuna_pkey" PRIMARY KEY ("id")
);
