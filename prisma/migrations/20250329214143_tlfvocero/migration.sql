/*
  Warnings:

  - Added the required column `tlfVocero` to the `ConsejoComunal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConsejoComunal" ADD COLUMN     "tlfVocero" TEXT NOT NULL;
