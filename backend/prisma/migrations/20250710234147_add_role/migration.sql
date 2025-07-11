-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PRODUCER');

-- AlterTable
ALTER TABLE "Producer" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PRODUCER';
