/*
  Warnings:

  - You are about to drop the column `priority` on the `Task` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "TaskType" ADD VALUE 'CODE_REVIEW';

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "priority";

-- DropEnum
DROP TYPE "TaskPriority";
