/*
  Warnings:

  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flare_org` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flare_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `socials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."event" DROP CONSTRAINT "event_flare_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."event" DROP CONSTRAINT "event_location_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."flare_org" DROP CONSTRAINT "flare_org_location_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."flare_org" DROP CONSTRAINT "flare_org_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."flare_user" DROP CONSTRAINT "flare_user_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."socials" DROP CONSTRAINT "socials_flare_id_fkey";

-- DropTable
DROP TABLE "public"."event";

-- DropTable
DROP TABLE "public"."flare_org";

-- DropTable
DROP TABLE "public"."flare_user";

-- DropTable
DROP TABLE "public"."location";

-- DropTable
DROP TABLE "public"."socials";

-- DropTable
DROP TABLE "public"."user";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_firebaseUid_idx" ON "User"("firebaseUid");
