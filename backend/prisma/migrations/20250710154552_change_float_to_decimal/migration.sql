/*
  Warnings:

  - You are about to alter the column `totalArea` on the `Farm` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `arableArea` on the `Farm` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `vegetationArea` on the `Farm` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Farm" ALTER COLUMN "totalArea" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "arableArea" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "vegetationArea" SET DATA TYPE DECIMAL(65,30);
