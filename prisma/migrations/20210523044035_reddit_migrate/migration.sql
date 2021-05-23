-- CreateEnum
CREATE TYPE "role" AS ENUM ('user', 'admin', 'superadmin');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_uid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "username" VARCHAR(150) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(250) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "post_uid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT,
    "slug" VARCHAR(150) NOT NULL,
    "identifier" VARCHAR(150) NOT NULL,
    "sub_name" VARCHAR(150) NOT NULL,
    "user_uid" UUID NOT NULL,
    "sub_uid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subs" (
    "id" SERIAL NOT NULL,
    "sub_uid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(200) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "image_urn" VARCHAR(250),
    "banner_urn" VARCHAR(250),
    "user_uid" UUID NOT NULL,
    "post_uid" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "comment_uid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "body" TEXT NOT NULL,
    "identifier" VARCHAR(150) NOT NULL,
    "username" VARCHAR(150) NOT NULL,
    "user_uid" UUID NOT NULL,
    "post_uid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users.user_uid_unique" ON "users"("user_uid");

-- CreateIndex
CREATE UNIQUE INDEX "users.username_unique" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "posts.post_uid_unique" ON "posts"("post_uid");

-- CreateIndex
CREATE UNIQUE INDEX "subs.sub_uid_unique" ON "subs"("sub_uid");

-- CreateIndex
CREATE UNIQUE INDEX "subs.name_unique" ON "subs"("name");

-- AddForeignKey
ALTER TABLE "posts" ADD FOREIGN KEY ("sub_uid") REFERENCES "subs"("sub_uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD FOREIGN KEY ("user_uid") REFERENCES "users"("user_uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subs" ADD FOREIGN KEY ("user_uid") REFERENCES "users"("user_uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD FOREIGN KEY ("post_uid") REFERENCES "posts"("post_uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD FOREIGN KEY ("user_uid") REFERENCES "users"("user_uid") ON DELETE CASCADE ON UPDATE CASCADE;
