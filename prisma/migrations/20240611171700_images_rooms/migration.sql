-- CreateTable
CREATE TABLE "TBL_DTL_IMAGES_CATEGORIES" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "userCreateAt" TEXT,
    "createDateAt" TIMESTAMP(3),
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "TBL_DTL_IMAGES_CATEGORIES_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TBL_DTL_IMAGES_CATEGORIES" ADD CONSTRAINT "TBL_DTL_IMAGES_CATEGORIES_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TBL_CATEGORIES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
