/*
  Warnings:

  - You are about to drop the column `userId` on the `OrganizationProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrganizationMemberRole" AS ENUM ('OWNER', 'ADMIN', 'EDITOR');

-- AlterEnum
ALTER TYPE "OrgStatus" ADD VALUE 'DRAFT';

-- DropForeignKey
ALTER TABLE "OrganizationProfile" DROP CONSTRAINT "OrganizationProfile_locationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationProfile" DROP CONSTRAINT "OrganizationProfile_userId_fkey";

-- DropIndex
DROP INDEX "OrganizationProfile_userId_key";

-- AlterTable
ALTER TABLE "OrganizationProfile" DROP COLUMN "userId",
ALTER COLUMN "status" SET DEFAULT 'DRAFT',
ALTER COLUMN "locationId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "OrganizationMemberRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("userId","organizationId")
);

-- CreateIndex
CREATE INDEX "OrganizationMember_organizationId_idx" ON "OrganizationMember"("organizationId");

-- AddForeignKey
ALTER TABLE "OrganizationProfile" ADD CONSTRAINT "OrganizationProfile_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "OrganizationProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
