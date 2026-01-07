/*
  Warnings:

  - Made the column `locationId` on table `OrganizationProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."OrganizationProfile" DROP CONSTRAINT "OrganizationProfile_locationId_fkey";

-- AlterTable
ALTER TABLE "OrganizationProfile" ALTER COLUMN "locationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "OrganizationProfile" ADD CONSTRAINT "OrganizationProfile_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
