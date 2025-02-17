-- AlterTable
ALTER TABLE "aggregate_votes" ADD COLUMN     "total_voters" JSONB NOT NULL DEFAULT '{}';
