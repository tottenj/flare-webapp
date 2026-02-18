/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_imageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_locationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_organizationId_fkey";

-- DropTable
DROP TABLE "public"."Event";

-- CreateTable
CREATE TABLE "FlareEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ageRestriction" "AgeRestriction" NOT NULL DEFAULT 'ALL_AGES',
    "imageId" TEXT,
    "startsAtUTC" TIMESTAMP(3) NOT NULL,
    "endsAtUTC" TIMESTAMP(3),
    "timezone" TEXT NOT NULL,
    "locationId" TEXT,
    "pricingType" "EventPricingType" NOT NULL,
    "minPriceCents" INTEGER,
    "maxPriceCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'CAD',
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlareEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FlareEvent_startsAtUTC_idx" ON "FlareEvent"("startsAtUTC");

-- CreateIndex
CREATE INDEX "FlareEvent_organizationId_idx" ON "FlareEvent"("organizationId");

-- CreateIndex
CREATE INDEX "FlareEvent_tags_idx" ON "FlareEvent" USING GIN ("tags");

-- AddForeignKey
ALTER TABLE "FlareEvent" ADD CONSTRAINT "FlareEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "OrganizationProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlareEvent" ADD CONSTRAINT "FlareEvent_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "ImageAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlareEvent" ADD CONSTRAINT "FlareEvent_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
