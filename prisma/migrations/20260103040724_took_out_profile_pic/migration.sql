/*
  Warnings:

  - You are about to drop the `ProfilePic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProfilePic" DROP CONSTRAINT "ProfilePic_imageAssetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProfilePic" DROP CONSTRAINT "ProfilePic_userId_fkey";

-- DropTable
DROP TABLE "public"."ProfilePic";
