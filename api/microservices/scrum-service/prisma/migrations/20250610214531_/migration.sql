/*
  Warnings:

  - You are about to drop the column `code` on the `Sprint` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Sprint_code_key";

-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "code";
