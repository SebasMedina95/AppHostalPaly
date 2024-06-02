-- CreateTable
CREATE TABLE "TBL_COMFORTS" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "userDocumentCreateAt" TEXT,
    "createDateAt" TIMESTAMP(3),
    "userDocumentUpdateAt" TEXT,
    "updateDateAt" TIMESTAMP(3),

    CONSTRAINT "TBL_COMFORTS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TBL_COMFORTS_name_key" ON "TBL_COMFORTS"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TBL_COMFORTS_description_key" ON "TBL_COMFORTS"("description");
