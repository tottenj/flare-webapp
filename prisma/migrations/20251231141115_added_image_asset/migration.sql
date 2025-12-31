/*
  Warnings:

  - You are about to drop the column `contentType` on the `OrgProofFile` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `OrgProofFile` table. All the data in the column will be lost.
  - You are about to drop the column `sizeBytes` on the `OrgProofFile` table. All the data in the column will be lost.
  - You are about to drop the column `storagePath` on the `OrgProofFile` table. All the data in the column will be lost.
  - Added the required column `imageAssetId` to the `OrgProofFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrgProofFile" DROP COLUMN "contentType",
DROP COLUMN "originalName",
DROP COLUMN "sizeBytes",
DROP COLUMN "storagePath",
ADD COLUMN     "imageAssetId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProfilePic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageAssetId" TEXT NOT NULL,

    CONSTRAINT "ProfilePic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageAsset" (
    "id" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "contentType" TEXT,
    "sizeBytes" INTEGER,
    "originalName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePic_userId_key" ON "ProfilePic"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePic_imageAssetId_key" ON "ProfilePic"("imageAssetId");

-- CreateIndex
CREATE INDEX "ProfilePic_userId_idx" ON "ProfilePic"("userId");

-- AddForeignKey
ALTER TABLE "OrgProofFile" ADD CONSTRAINT "OrgProofFile_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "ImageAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePic" ADD CONSTRAINT "ProfilePic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePic" ADD CONSTRAINT "ProfilePic_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "ImageAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
