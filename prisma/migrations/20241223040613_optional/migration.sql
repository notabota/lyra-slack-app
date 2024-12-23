/*
  Warnings:

  - The `updated` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "realName" DROP NOT NULL,
ALTER COLUMN "displayName" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "teamId" DROP NOT NULL,
ALTER COLUMN "isAdmin" DROP NOT NULL,
ALTER COLUMN "isOwner" DROP NOT NULL,
ALTER COLUMN "isPrimaryOwner" DROP NOT NULL,
ALTER COLUMN "isRestricted" DROP NOT NULL,
ALTER COLUMN "isUltraRestricted" DROP NOT NULL,
ALTER COLUMN "isBot" DROP NOT NULL,
DROP COLUMN "updated",
ADD COLUMN     "updated" INTEGER,
ALTER COLUMN "isEmailConfirmed" DROP NOT NULL,
ALTER COLUMN "whoCanShareContactCard" DROP NOT NULL,
ALTER COLUMN "color" DROP NOT NULL,
ALTER COLUMN "tz" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;
