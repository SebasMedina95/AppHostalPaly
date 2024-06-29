-- CreateTable
CREATE TABLE "TBL_PLANS" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(40) NOT NULL,
    "urlImage" TEXT DEFAULT 'default.png',
    "description" VARCHAR(1000),
    "highSeasonPrice" DECIMAL(15,2) NOT NULL,
    "LowSeasonPrice" DECIMAL(15,2) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "userCreateAt" TEXT,
    "createDateAt" TIMESTAMP(3),
    "userUpdateAt" TEXT,
    "updateDateAt" TIMESTAMP(3),

    CONSTRAINT "TBL_PLANS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TBL_PLANS_type_key" ON "TBL_PLANS"("type");

-- CreateIndex
CREATE UNIQUE INDEX "TBL_PLANS_description_key" ON "TBL_PLANS"("description");
