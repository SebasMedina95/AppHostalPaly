/*
  Warnings:

  - You are about to drop the column `userDocumentCreateAt` on the `TBL_CATEGORIES` table. All the data in the column will be lost.
  - You are about to drop the column `userDocumentUpdateAt` on the `TBL_CATEGORIES` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TBL_CATEGORIES" DROP COLUMN "userDocumentCreateAt",
DROP COLUMN "userDocumentUpdateAt",
ADD COLUMN     "userCreateAt" TEXT,
ADD COLUMN     "userUpdateAt" TEXT;
