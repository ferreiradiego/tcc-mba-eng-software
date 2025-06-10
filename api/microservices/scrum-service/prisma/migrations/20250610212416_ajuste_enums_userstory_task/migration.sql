/*
  Warnings:

  - Changed the type of `status` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `priority` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `UserStory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserStoryStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('BUG', 'IMPROVEMENT', 'FEATURE');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL,
DROP COLUMN "priority",
ADD COLUMN     "priority" "TaskPriority" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "TaskType" NOT NULL;

-- AlterTable
ALTER TABLE "UserStory" DROP COLUMN "status",
ADD COLUMN     "status" "UserStoryStatus" NOT NULL;
