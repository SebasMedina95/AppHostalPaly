-- CreateTable
CREATE TABLE "TBL_RESERVATIONS" (
    "id" SERIAL NOT NULL,
    "reservationCode" VARCHAR(50) NOT NULL,
    "valueReservation" DOUBLE PRECISION NOT NULL,
    "transactionNumber" VARCHAR(250) DEFAULT 'Pendiente',
    "orderTransaction" VARCHAR(250) DEFAULT 'Pendiente',
    "typeTransaction" VARCHAR(250) DEFAULT 'Pendiente',
    "paymentMethod" VARCHAR(250) DEFAULT 'Pendiente',
    "descriptionReservation" VARCHAR(1000) NOT NULL,
    "initialDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "daysNumber" INTEGER NOT NULL,
    "statusTransaction" TEXT NOT NULL,
    "dateTransactionFinal" TIMESTAMP(3),
    "userCreateAt" TEXT,
    "createDateAt" TIMESTAMP(3),
    "userUpdateAt" TEXT,
    "updateDateAt" TIMESTAMP(3),
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,

    CONSTRAINT "TBL_RESERVATIONS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TBL_RESERVATIONS_reservationCode_key" ON "TBL_RESERVATIONS"("reservationCode");

-- AddForeignKey
ALTER TABLE "TBL_RESERVATIONS" ADD CONSTRAINT "TBL_RESERVATIONS_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "TBL_ROOMS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBL_RESERVATIONS" ADD CONSTRAINT "TBL_RESERVATIONS_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TBL_USERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBL_RESERVATIONS" ADD CONSTRAINT "TBL_RESERVATIONS_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TBL_PLANS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
