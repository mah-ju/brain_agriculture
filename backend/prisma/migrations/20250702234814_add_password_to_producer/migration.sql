/*
  Warnings:

  - Added the required column `password` to the `Producer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Producer" ADD COLUMN     "password" TEXT NOT NULL;
