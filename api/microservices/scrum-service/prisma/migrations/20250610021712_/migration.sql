-- AlterEnum
ALTER TYPE "CeremonyType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "Ceremony" ADD COLUMN     "typeDesc" TEXT;
