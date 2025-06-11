/*
  Warnings:

  - You are about to drop the column `duration` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ceremony" ADD COLUMN     "sprintId" TEXT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "duration";

-- AddForeignKey
ALTER TABLE "Ceremony" ADD CONSTRAINT "Ceremony_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
