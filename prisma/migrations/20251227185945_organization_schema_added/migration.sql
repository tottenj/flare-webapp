-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProofPlatform" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'X', 'OTHER');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ORG';

-- DropIndex
DROP INDEX "public"."User_firebaseUid_idx";

-- CreateTable
CREATE TABLE "OrganizationProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "status" "OrgStatus" NOT NULL DEFAULT 'PENDING',
    "locationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgSocial" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "instagramHandle" TEXT,
    "facebookHandle" TEXT,
    "xHandle" TEXT,
    "otherText" TEXT,

    CONSTRAINT "OrgSocial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgProofFile" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "platform" "ProofPlatform" NOT NULL,
    "storagePath" TEXT NOT NULL,
    "contentType" TEXT,
    "sizeBytes" INTEGER,
    "originalName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrgProofFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "placeId" TEXT,
    "address" TEXT,
    "point" geography(Point, 4326) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationProfile_userId_key" ON "OrganizationProfile"("userId");

-- CreateIndex
CREATE INDEX "OrganizationProfile_status_idx" ON "OrganizationProfile"("status");

-- CreateIndex
CREATE UNIQUE INDEX "OrgSocial_organizationId_key" ON "OrgSocial"("organizationId");

-- CreateIndex
CREATE INDEX "OrgProofFile_organizationId_idx" ON "OrgProofFile"("organizationId");

-- CreateIndex
CREATE INDEX "Location_point_idx" ON "Location" USING GIST ("point");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- AddForeignKey
ALTER TABLE "OrganizationProfile" ADD CONSTRAINT "OrganizationProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationProfile" ADD CONSTRAINT "OrganizationProfile_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgSocial" ADD CONSTRAINT "OrgSocial_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "OrganizationProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgProofFile" ADD CONSTRAINT "OrgProofFile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "OrganizationProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
