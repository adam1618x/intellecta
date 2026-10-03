-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "completed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "enrolled" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "image" TEXT;
