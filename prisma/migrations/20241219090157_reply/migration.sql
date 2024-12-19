/*
  Warnings:

  - A unique constraint covering the columns `[timestamp]` on the table `message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "message" ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "threadTs" TEXT;

-- CreateTable
CREATE TABLE "reaction" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "itemUser" TEXT NOT NULL,
    "eventTs" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "message_timestamp_key" ON "message"("timestamp");

-- AddForeignKey
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
