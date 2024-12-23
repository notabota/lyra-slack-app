/*
  Warnings:

  - Changed the type of `userId` on the `message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "message" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "message" ADD COLUMN "userIdInt" INTEGER;
UPDATE "message" m SET "userIdInt" = u.id 
FROM "user" u WHERE m."userId"::text = u."userId";
ALTER TABLE "message" ALTER COLUMN "userIdInt" SET NOT NULL;
ALTER TABLE "message" DROP COLUMN "userId";
ALTER TABLE "message" RENAME COLUMN "userIdInt" TO "userId";

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
