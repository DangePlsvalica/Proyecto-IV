/*
  Warnings:

  - You are about to drop the column `voceroId` on the `ConsejoComunal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConsejoComunal" DROP CONSTRAINT "ConsejoComunal_voceroId_fkey";

-- DropIndex
DROP INDEX "ConsejoComunal_voceroId_key";

-- AlterTable
ALTER TABLE "ConsejoComunal" DROP COLUMN "voceroId";
