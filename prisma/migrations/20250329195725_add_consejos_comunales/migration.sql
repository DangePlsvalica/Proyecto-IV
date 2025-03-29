-- CreateTable
CREATE TABLE "ConsejoComunal" (
    "id" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "parroquia" TEXT NOT NULL,
    "cc" TEXT NOT NULL,
    "rif" TEXT NOT NULL,
    "numeroCuenta" TEXT NOT NULL,
    "fechaConstitucion" TIMESTAMP(3) NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "vocero" TEXT NOT NULL,
    "poblacionVotante" INTEGER NOT NULL,

    CONSTRAINT "ConsejoComunal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConsejoComunal_rif_key" ON "ConsejoComunal"("rif");
