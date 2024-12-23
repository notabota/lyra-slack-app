-- CreateTable
CREATE TABLE "channel" (
    "id" SERIAL NOT NULL,
    "channelId" TEXT NOT NULL,
    "name" TEXT,
    "updated" INTEGER,
    "creator" TEXT,
    "lastRead" TEXT,
    "isChannel" BOOLEAN,
    "isGroup" BOOLEAN,
    "isIm" BOOLEAN,
    "isMpim" BOOLEAN,
    "isPrivate" BOOLEAN,
    "isArchived" BOOLEAN,
    "isGeneral" BOOLEAN,
    "isShared" BOOLEAN,
    "isOrgShared" BOOLEAN,
    "contextTeamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);
