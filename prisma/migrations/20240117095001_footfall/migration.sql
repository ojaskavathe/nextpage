-- CreateEnum
CREATE TYPE "DDType" AS ENUM ('FREE', 'PAID');

-- CreateEnum
CREATE TYPE "FootfallType" AS ENUM ('ISSUE', 'RETURN', 'BOTH');

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "freeDD" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "patronId" INTEGER NOT NULL,
    "scheduledFor" DATE NOT NULL,
    "type" "DDType" NOT NULL,
    "numBooks" INTEGER NOT NULL,
    "message" TEXT,
    "footfallId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Footfall" (
    "id" TEXT NOT NULL,
    "patronId" INTEGER NOT NULL,
    "type" "FootfallType" NOT NULL,
    "isDD" BOOLEAN NOT NULL DEFAULT false,
    "offer" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Footfall_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_footfallId_key" ON "Delivery"("footfallId");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "Patron"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_footfallId_fkey" FOREIGN KEY ("footfallId") REFERENCES "Footfall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Footfall" ADD CONSTRAINT "Footfall_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "Patron"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
