/*
  Warnings:

  - You are about to drop the column `endTime` on the `TimeLog` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `TimeLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TimeLog" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "completedAt" TIMESTAMP(3);
