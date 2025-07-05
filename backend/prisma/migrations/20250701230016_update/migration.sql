-- CreateTable
CREATE TABLE "Producer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpfOrCnpj" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "totalArea" DOUBLE PRECISION NOT NULL,
    "arableArea" DOUBLE PRECISION NOT NULL,
    "vegetationArea" DOUBLE PRECISION NOT NULL,
    "producerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CropSeason" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "farmId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CropSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantedCrop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cropSeasonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantedCrop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producer_cpfOrCnpj_key" ON "Producer"("cpfOrCnpj");

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropSeason" ADD CONSTRAINT "CropSeason_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantedCrop" ADD CONSTRAINT "PlantedCrop_cropSeasonId_fkey" FOREIGN KEY ("cropSeasonId") REFERENCES "CropSeason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
