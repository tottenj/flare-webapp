import fs from 'node:fs';
import { config as dotenvConfig } from 'dotenv';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function loadEnvFiles() {
  const envFiles = ['.env', '.env.dev'];

  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      dotenvConfig({ path: envFile, override: true });
    }
  }
}

async function waitForEmulators(maxAttempts = 30, waitMs = 1000) {
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'flare-7091a';
  const functionsUrl = (process.env.FUNCTIONS_URL || 'http://127.0.0.1:5001').replace(/\/$/, '');
  const functionsBase = `${functionsUrl}/${projectId}/us-central1`;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const hubRes = await fetch('http://127.0.0.1:4400/emulators');
      if (!hubRes.ok) {
        throw new Error(`Hub status ${hubRes.status}`);
      }

      const fnRes = await fetch(functionsBase);
      if (fnRes.status === 200 || fnRes.status === 404) {
        return { projectId, functionsBase };
      }

      throw new Error(`Functions status ${fnRes.status}`);
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(`Emulators not ready after ${maxAttempts} attempts: ${error.message}`);
      }
      await delay(waitMs);
    }
  }

  throw new Error('Emulators did not become ready.');
}

async function seedFunction(functionsBase, functionName, maxRetries = 15, waitMs = 1000) {
  const endpoint = `${functionsBase}/${functionName}`;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await fetch(endpoint, { method: 'POST' });
      const bodyText = await response.text();
      let payload;

      try {
        payload = JSON.parse(bodyText);
      } catch {
        payload = { raw: bodyText };
      }

      if (response.status === 200 && payload?.success === true) {
        console.log(`Seeded ${functionName}`);
        return;
      }

      if (attempt === maxRetries) {
        throw new Error(
          `${functionName} failed with status ${response.status}: ${JSON.stringify(payload)}`
        );
      }
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(`${functionName} request failed: ${error.message}`);
      }
    }

    console.log(`Waiting for ${functionName} (${attempt}/${maxRetries})`);
    await delay(waitMs);
  }
}

async function main() {
  loadEnvFiles();

  const { functionsBase } = await waitForEmulators();

  await seedFunction(functionsBase, 'seedAuthEmulator');
  await seedFunction(functionsBase, 'seedStorageEmulator');

  console.log('Firebase emulators seeded successfully.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
