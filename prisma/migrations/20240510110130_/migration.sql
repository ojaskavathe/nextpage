/*
  Warnings:

  - The primary key for the `ExpenseCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ExpenseCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExpenseCategory" DROP CONSTRAINT "ExpenseCategory_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ExpenseCategory_pkey" PRIMARY KEY ("name");
