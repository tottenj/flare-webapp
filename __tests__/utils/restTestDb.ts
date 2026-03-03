// tests/utils/resetTestDb.ts
import { execSync } from 'child_process';
import { prisma } from '../../prisma/prismaClient';

export function resetTestDb() {
  execSync('npm run db:reset', { stdio: 'inherit' });
  execSync('npm run seed:test', { stdio: 'inherit' });
}

export function resetTestDbNoSeed() {
  execSync('npm run db:reset', { stdio: 'inherit' });
}

export async function resetTestDbFast() {
  await prisma.$executeRawUnsafe(`
  TRUNCATE TABLE
    "EventTag",
    "FlareEvent",
    "Tag",
    "OrganizationProfile",
    "User",
    "Location",
    "ImageAsset"
  RESTART IDENTITY CASCADE
`);
}
