-- DropForeignKey
ALTER TABLE "CropSeason" DROP CONSTRAINT "CropSeason_farmId_fkey";

-- DropForeignKey
ALTER TABLE "PlantedCrop" DROP CONSTRAINT "PlantedCrop_cropSeasonId_fkey";

-- AddForeignKey
ALTER TABLE "CropSeason" ADD CONSTRAINT "CropSeason_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantedCrop" ADD CONSTRAINT "PlantedCrop_cropSeasonId_fkey" FOREIGN KEY ("cropSeasonId") REFERENCES "CropSeason"("id") ON DELETE CASCADE ON UPDATE CASCADE;
