-- Migration: remove slug column from Publication
ALTER TABLE "Publication" DROP COLUMN IF EXISTS "slug";
