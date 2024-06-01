/*
  Warnings:

  - The `theme` column on the `TBL_CATEGORIES` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TBL_CATEGORIES" DROP COLUMN "theme",
ADD COLUMN     "theme" TEXT;

-- DropEnum
DROP TYPE "ETheme";
