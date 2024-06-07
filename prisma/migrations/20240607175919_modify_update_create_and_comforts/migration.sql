/*
  Warnings:

  - You are about to drop the column `userDocumentCreateAt` on the `TBL_COMFORTS` table. All the data in the column will be lost.
  - You are about to drop the column `userDocumentUpdateAt` on the `TBL_COMFORTS` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TBL_COMFORTS" DROP COLUMN "userDocumentCreateAt",
DROP COLUMN "userDocumentUpdateAt",
ADD COLUMN     "userCreateAt" TEXT,
ADD COLUMN     "userUpdateAt" TEXT;

-- AlterTable
ALTER TABLE "TBL_USERS" ADD COLUMN     "userWhoBlock" TEXT;

-- CreateTable
CREATE TABLE "TBL_ROOMS" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "maintenance" BOOLEAN NOT NULL DEFAULT false,
    "description" VARCHAR(5000),
    "userCreateAt" TEXT,
    "createDateAt" TIMESTAMP(3),
    "userUpdateAt" TEXT,
    "updateDateAt" TIMESTAMP(3),
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "TBL_ROOMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TBL_DTL_COMFORTS_CATEGORIES" (
    "id" SERIAL NOT NULL,
    "userCreateAt" TEXT,
    "createDateAt" TIMESTAMP(3),
    "categoryId" INTEGER NOT NULL,
    "comfortId" INTEGER NOT NULL,

    CONSTRAINT "TBL_DTL_COMFORTS_CATEGORIES_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TBL_ROOMS_name_key" ON "TBL_ROOMS"("name");

-- AddForeignKey
ALTER TABLE "TBL_ROOMS" ADD CONSTRAINT "TBL_ROOMS_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TBL_CATEGORIES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBL_DTL_COMFORTS_CATEGORIES" ADD CONSTRAINT "TBL_DTL_COMFORTS_CATEGORIES_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TBL_CATEGORIES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBL_DTL_COMFORTS_CATEGORIES" ADD CONSTRAINT "TBL_DTL_COMFORTS_CATEGORIES_comfortId_fkey" FOREIGN KEY ("comfortId") REFERENCES "TBL_COMFORTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
