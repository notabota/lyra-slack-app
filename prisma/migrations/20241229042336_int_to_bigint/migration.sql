-- AlterTable
ALTER TABLE "channel" ALTER COLUMN "updated" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "timestamp" SET DATA TYPE BIGINT,
ALTER COLUMN "size" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "updated" SET DATA TYPE BIGINT;
