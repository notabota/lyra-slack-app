/*
  Warnings:

  - Changed the type of `channelId` on the `message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "message" ADD COLUMN "channelIdInt" INTEGER;
UPDATE "message" m SET "channelIdInt" = c.id 
FROM "channel" c WHERE m."channelId"::text = c."channelId";
ALTER TABLE "message" ALTER COLUMN "channelIdInt" SET NOT NULL;
ALTER TABLE "message" DROP COLUMN "channelId";
ALTER TABLE "message" RENAME COLUMN "channelIdInt" TO "channelId";

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
