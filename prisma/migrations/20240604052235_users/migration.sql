-- CreateTable
CREATE TABLE "TBL_USERS" (
    "id" SERIAL NOT NULL,
    "names" VARCHAR(150) NOT NULL,
    "lastnames" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "emailValidated" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR(100) NOT NULL,
    "roles" TEXT[] DEFAULT ARRAY['USER']::TEXT[],
    "gender" VARCHAR(1) NOT NULL,
    "img" TEXT DEFAULT 'default.png',
    "phone1" TEXT,
    "phone2" TEXT,
    "isBlock" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TBL_USERS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TBL_USERS_email_key" ON "TBL_USERS"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TBL_USERS_gender_key" ON "TBL_USERS"("gender");
