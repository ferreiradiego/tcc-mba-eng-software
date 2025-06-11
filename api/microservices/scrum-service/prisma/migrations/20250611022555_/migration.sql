/*
  Warnings:

  - You are about to drop the `TimeLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_ceremonyId_fkey";

-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_taskId_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "TimeLog";
