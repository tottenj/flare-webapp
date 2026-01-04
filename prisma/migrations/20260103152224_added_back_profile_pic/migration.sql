-- CreateTable
CREATE TABLE "ProfilePic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageAssetId" TEXT NOT NULL,

    CONSTRAINT "ProfilePic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePic_userId_key" ON "ProfilePic"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePic_imageAssetId_key" ON "ProfilePic"("imageAssetId");

-- CreateIndex
CREATE INDEX "ProfilePic_userId_idx" ON "ProfilePic"("userId");

-- AddForeignKey
ALTER TABLE "ProfilePic" ADD CONSTRAINT "ProfilePic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePic" ADD CONSTRAINT "ProfilePic_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "ImageAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
