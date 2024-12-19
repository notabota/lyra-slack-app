/*
  Warnings:

  - You are about to drop the column `clientMsgId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "clientMsgId",
DROP COLUMN "teamId",
ALTER COLUMN "text" DROP NOT NULL;

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "fileId" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "title" TEXT,
    "pretty_type" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "user" TEXT,
    "size" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "urlPrivate" TEXT,
    "urlPrivateDownload" TEXT,
    "permalink" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
