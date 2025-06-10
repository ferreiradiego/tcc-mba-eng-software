/*
  Warnings:

  - You are about to drop the `Week` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Week" DROP CONSTRAINT "Week_sprintId_fkey";

-- DropTable
DROP TABLE "Week";
