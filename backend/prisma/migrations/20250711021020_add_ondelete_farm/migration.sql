-- DropForeignKey
ALTER TABLE "Farm" DROP CONSTRAINT "Farm_producerId_fkey";

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
