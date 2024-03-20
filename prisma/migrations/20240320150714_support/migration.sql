/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Support` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `supportId` to the `Footfall` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Support` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supportId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'NON_ADMIN');

-- DropIndex
DROP INDEX "Support_id_key";

-- AlterTable
ALTER TABLE "Footfall" ADD COLUMN     "supportId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Support" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'NON_ADMIN',
ADD COLUMN     "username" TEXT NOT NULL,
ADD CONSTRAINT "Support_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "supportId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Support_username_key" ON "Support"("username");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_supportId_fkey" FOREIGN KEY ("supportId") REFERENCES "Support"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Footfall" ADD CONSTRAINT "Footfall_supportId_fkey" FOREIGN KEY ("supportId") REFERENCES "Support"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
