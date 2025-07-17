-- DropForeignKey
ALTER TABLE "CropSeason" DROP CONSTRAINT "CropSeason_farmId_fkey";

-- AddForeignKey
ALTER TABLE "CropSeason" ADD CONSTRAINT "CropSeason_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
