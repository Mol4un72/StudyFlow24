-- AlterTable
ALTER TABLE "user" ADD COLUMN     "accessUntil" TIMESTAMP(3),
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false;
