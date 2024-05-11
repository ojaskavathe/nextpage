-- CreateTable
CREATE TABLE "CashReport" (
    "id" TEXT NOT NULL,
    "supportId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CashReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CashReport" ADD CONSTRAINT "CashReport_supportId_fkey" FOREIGN KEY ("supportId") REFERENCES "Support"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
