-- CreateTable
CREATE TABLE "Checkout" (
    "id" TEXT NOT NULL,
    "patronId" INTEGER NOT NULL,
    "itemBarcode" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "checked_out" TIMESTAMP(3) NOT NULL,
    "checked_in" TIMESTAMP(3),

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "Patron"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
