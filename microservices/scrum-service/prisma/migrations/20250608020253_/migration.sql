-- CreateEnum
CREATE TYPE "CeremonyType" AS ENUM ('DAILY', 'PLANNING', 'REVIEW', 'RETROSPECTIVE');

-- CreateTable
CREATE TABLE "Ceremony" (
    "id" TEXT NOT NULL,
    "type" "CeremonyType" NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "participants" TEXT[],
    "timeLogs" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ceremony_pkey" PRIMARY KEY ("id")
);
