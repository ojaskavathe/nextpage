/*
  Warnings:

  - You are about to drop the column `Remarks` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "Remarks",
ADD COLUMN     "remarks" TEXT;
