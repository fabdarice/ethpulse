/*
  Warnings:

  - You are about to drop the column `last_updated_at` on the `aggregate_votes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "aggregate_votes" DROP COLUMN "last_updated_at";
