/*
  Warnings:

  - You are about to drop the column `tags` on the `FlareEvent` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."FlareEvent_tags_idx";

-- AlterTable
ALTER TABLE "FlareEvent" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "EventTag" (
    "eventId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "EventTag_pkey" PRIMARY KEY ("eventId","tagId")
);

-- CreateIndex
CREATE INDEX "EventTag_tagId_idx" ON "EventTag"("tagId");

-- AddForeignKey
ALTER TABLE "EventTag" ADD CONSTRAINT "EventTag_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FlareEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTag" ADD CONSTRAINT "EventTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
