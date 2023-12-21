-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SIGNUP', 'RENEWAL', 'DD', 'CLOSURE', 'ADDON', 'REFUND');

-- CreateEnum
CREATE TYPE "TransactionMode" AS ENUM ('CASH', 'CARD', 'UPI', 'RAZORPAY', 'OTHER');

-- CreateTable
CREATE TABLE "Support" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Patron" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "altPhone" TEXT,
    "address" TEXT,
    "pincode" TEXT,
    "joiningDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "whatsapp" BOOLEAN NOT NULL DEFAULT false,
    "deposit" INTEGER NOT NULL DEFAULT 0,
    "deposit_sr" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,

    CONSTRAINT "Patron_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "patronId" INTEGER NOT NULL,
    "plan" INTEGER NOT NULL,
    "expiryDate" DATE NOT NULL,
    "freeDD" INTEGER NOT NULL,
    "freeHoliday" INTEGER NOT NULL,
    "lastIssued" DATE,
    "lastReturned" DATE,
    "booksInHand" INTEGER NOT NULL DEFAULT 0,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "offer" TEXT,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "patronId" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL DEFAULT 'SIGNUP',
    "mode" "TransactionMode" NOT NULL,
    "registration" INTEGER,
    "deposit" INTEGER,
    "readingFees" INTEGER,
    "DDFees" INTEGER DEFAULT 0,
    "discount" INTEGER,
    "pastDues" INTEGER DEFAULT 0,
    "adjust" INTEGER DEFAULT 0,
    "reason" TEXT,
    "offer" TEXT,
    "remarks" TEXT,
    "netPayable" INTEGER NOT NULL,
    "oldPlan" INTEGER NOT NULL,
    "newPlan" INTEGER NOT NULL,
    "oldExpiry" DATE NOT NULL,
    "newExpiry" DATE NOT NULL,
    "attendedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Support_id_key" ON "Support"("id");

-- CreateIndex
CREATE INDEX "Patron_id_idx" ON "Patron"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_patronId_key" ON "Subscription"("patronId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "Patron"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "Patron"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
