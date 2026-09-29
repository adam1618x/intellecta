-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- Rename Admin -> User (keeps existing rows)
ALTER TABLE "Admin" RENAME TO "User";
ALTER TABLE "User" RENAME CONSTRAINT "Admin_pkey" TO "User_pkey";
ALTER INDEX "Admin_username_key" RENAME TO "User_username_key";
ALTER SEQUENCE "Admin_id_seq" RENAME TO "User_id_seq";

-- New columns: existing rows (admins) get ADMIN, future rows default to USER
ALTER TABLE "User" ADD COLUMN "email" TEXT,
ADD COLUMN "role" "Role" NOT NULL DEFAULT 'ADMIN';
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");