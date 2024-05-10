/*
  Warnings:

  - Added the required column `mode` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "mode" "TransactionMode" NOT NULL;
