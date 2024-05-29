-- CreateEnum
CREATE TYPE "ETheme" AS ENUM ('Presidencial', 'Romantica', 'Caribe', 'Suite', 'Familiar', 'Estandar');

-- CreateTable
CREATE TABLE "TBL_CATEGORIES" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(5000) NOT NULL,
    "theme" "ETheme" NOT NULL,
    "status" BOOLEAN NOT NULL,
    "userDocumentCreateAt" TEXT,
    "createDateAt" TIMESTAMP(3),
    "userDocumentUpdateAt" TEXT,
    "updateDateAt" TIMESTAMP(3),

    CONSTRAINT "TBL_CATEGORIES_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TBL_CATEGORIES_name_key" ON "TBL_CATEGORIES"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TBL_CATEGORIES_description_key" ON "TBL_CATEGORIES"("description");
