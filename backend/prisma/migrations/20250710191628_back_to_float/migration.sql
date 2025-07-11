/*
  Warnings:

  - You are about to alter the column `totalArea` on the `Farm` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `arableArea` on the `Farm` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `vegetationArea` on the `Farm` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Farm" ALTER COLUMN "totalArea" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "arableArea" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "vegetationArea" SET DATA TYPE DOUBLE PRECISION;
