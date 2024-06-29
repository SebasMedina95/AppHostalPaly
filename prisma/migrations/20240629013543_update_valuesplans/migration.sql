/*
  Warnings:

  - You are about to alter the column `highSeasonPrice` on the `TBL_PLANS` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.
  - You are about to alter the column `LowSeasonPrice` on the `TBL_PLANS` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "TBL_PLANS" ALTER COLUMN "highSeasonPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "LowSeasonPrice" SET DATA TYPE DOUBLE PRECISION;
