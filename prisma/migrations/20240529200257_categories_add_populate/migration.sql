/*
  Warnings:

  - Added the required column `populate` to the `TBL_CATEGORIES` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TBL_CATEGORIES" ADD COLUMN     "populate" INTEGER NOT NULL;
