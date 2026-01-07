CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "account_type" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flare_user" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "flare_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flare_org" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "location_id" TEXT NOT NULL,

    CONSTRAINT "flare_org_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "flare_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION DEFAULT 0,
    "ticketLink" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location_id" TEXT NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "name" TEXT,
    "coordinates" geography NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socials" (
    "id" TEXT NOT NULL,
    "flare_id" TEXT NOT NULL,
    "twitter" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "other" TEXT,

    CONSTRAINT "socials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "flare_user_user_id_key" ON "flare_user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "flare_org_user_id_key" ON "flare_org"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "location_place_id_key" ON "location"("place_id");

-- CreateIndex
CREATE UNIQUE INDEX "socials_flare_id_key" ON "socials"("flare_id");

-- AddForeignKey
ALTER TABLE "flare_user" ADD CONSTRAINT "flare_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flare_org" ADD CONSTRAINT "flare_org_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flare_org" ADD CONSTRAINT "flare_org_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_flare_id_fkey" FOREIGN KEY ("flare_id") REFERENCES "flare_org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "socials" ADD CONSTRAINT "socials_flare_id_fkey" FOREIGN KEY ("flare_id") REFERENCES "flare_org"("id") ON DELETE CASCADE ON UPDATE CASCADE;
