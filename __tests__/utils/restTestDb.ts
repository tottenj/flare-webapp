// tests/utils/resetTestDb.ts
import { execSync } from 'child_process';

export function resetTestDb() {
  execSync('npm run db:reset', { stdio: 'inherit' });
  execSync('npm run seed:test', { stdio: 'inherit' });
}
