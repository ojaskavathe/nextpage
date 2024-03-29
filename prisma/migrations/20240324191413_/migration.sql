-- CreateTable
CREATE TABLE "Addon" (
    "id" TEXT NOT NULL,
    "patronId" INTEGER NOT NULL,
    "plan" INTEGER NOT NULL,
    "expiryDate" DATE NOT NULL,

    CONSTRAINT "Addon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Addon_patronId_key" ON "Addon"("patronId");

-- AddForeignKey
ALTER TABLE "Addon" ADD CONSTRAINT "Addon_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "Patron"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
