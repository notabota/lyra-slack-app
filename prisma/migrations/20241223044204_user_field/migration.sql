/*
  Warnings:

  - You are about to drop the column `user` on the `file` table. All the data in the column will be lost.
  - Added the required column `userId` to the `file` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `reaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN "userId" INTEGER;
UPDATE "file" f SET "userId" = u.id 
FROM "user" u WHERE f."user"::text = u."userId";
ALTER TABLE "file" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "file" DROP COLUMN "user";

-- AlterTable
ALTER TABLE "reaction" ADD COLUMN "userIdInt" INTEGER;
UPDATE "reaction" r SET "userIdInt" = u.id 
FROM "user" u WHERE r."userId"::text = u."userId";
ALTER TABLE "reaction" ALTER COLUMN "userIdInt" SET NOT NULL;
ALTER TABLE "reaction" DROP COLUMN "userId";
ALTER TABLE "reaction" RENAME COLUMN "userIdInt" TO "userId";

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
