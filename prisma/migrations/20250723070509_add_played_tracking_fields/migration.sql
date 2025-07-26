-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "currentlyPlaying" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "playedAt" TIMESTAMP(3);
