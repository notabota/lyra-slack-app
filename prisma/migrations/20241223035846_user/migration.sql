-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "realName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "isOwner" BOOLEAN NOT NULL,
    "isPrimaryOwner" BOOLEAN NOT NULL,
    "isRestricted" BOOLEAN NOT NULL,
    "isUltraRestricted" BOOLEAN NOT NULL,
    "isBot" BOOLEAN NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL,
    "isEmailConfirmed" BOOLEAN NOT NULL,
    "whoCanShareContactCard" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "tz" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
