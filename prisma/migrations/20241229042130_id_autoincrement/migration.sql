-- AlterTable
CREATE SEQUENCE channel_id_seq;
ALTER TABLE "channel" ALTER COLUMN "id" SET DEFAULT nextval('channel_id_seq');
ALTER SEQUENCE channel_id_seq OWNED BY "channel"."id";

-- AlterTable
CREATE SEQUENCE file_id_seq;
ALTER TABLE "file" ALTER COLUMN "id" SET DEFAULT nextval('file_id_seq');
ALTER SEQUENCE file_id_seq OWNED BY "file"."id";

-- AlterTable
CREATE SEQUENCE message_id_seq;
ALTER TABLE "message" ALTER COLUMN "id" SET DEFAULT nextval('message_id_seq');
ALTER SEQUENCE message_id_seq OWNED BY "message"."id";

-- AlterTable
CREATE SEQUENCE reaction_id_seq;
ALTER TABLE "reaction" ALTER COLUMN "id" SET DEFAULT nextval('reaction_id_seq');
ALTER SEQUENCE reaction_id_seq OWNED BY "reaction"."id";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "user"."id";
