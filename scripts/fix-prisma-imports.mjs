#!/usr/bin/env node

/**
 * Post-generation script to fix Prisma v7 ESM imports.
 *
 * Prisma v7 generates files with relative .js imports which don't work
 * well with Turbopack's module resolution. This script converts those
 * relative imports to use path aliases (#prisma/*) that are defined
 * in tsconfig.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GENERATED_DIR = path.join(__dirname, '..', 'prisma', 'generated');

function fixImportsInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Replace relative imports with path aliases
  const replacements = [
    // Import statements
    [
      /import\s+(\*\s+as\s+\$Enums)\s+from\s+['"](\.\/enums\.js)['"]/,
      `import $1 from "#prisma/generated/enums"`,
    ],
    [
      /import\s+(\*\s+as\s+\$Class)\s+from\s+['"](\.\/internal\/class\.js)['"]/,
      `import $1 from "#prisma/generated/internal/class"`,
    ],
    [
      /import\s+(\*\s+as\s+Prisma)\s+from\s+['"](\.\/internal\/prismaNamespace\.js)['"]/,
      `import $1 from "#prisma/generated/internal/prismaNamespace"`,
    ],

    // Export statements (with various quote styles and spacing)
    [
      /export\s+\*\s+as\s+\$Enums\s+from\s+['"](\.\/enums\.js)['"]/,
      `export * as $Enums from '#prisma/generated/enums'`,
    ],
    [/export\s+\*\s+from\s+['"](\.\/enums\.js)['"]/, `export * from "#prisma/generated/enums"`],

    // Harden Prisma-generated dirname shim for build environments where import.meta.url is absent.
    [
      /globalThis\['__dirname'\]\s*=\s*path\.dirname\(fileURLToPath\(import\.meta\.url\)\)/,
      `const __prismaImportMetaUrl = typeof import.meta !== 'undefined' ? import.meta.url : undefined\nglobalThis['__dirname'] = __prismaImportMetaUrl ? path.dirname(fileURLToPath(__prismaImportMetaUrl)) : process.cwd()`,
    ],
  ];

  replacements.forEach(([regex, replacement]) => {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Fixed imports in ${path.relative(process.cwd(), filePath)}`);
  }

  return modified;
}

function main() {
  if (!fs.existsSync(GENERATED_DIR)) {
    console.log(`Prisma generated directory not found at ${GENERATED_DIR}`);
    return;
  }

  console.log('Fixing Prisma v7 ESM imports...');

  // Fix the main client.ts file
  const clientPath = path.join(GENERATED_DIR, 'client.ts');
  fixImportsInFile(clientPath);

  // Also check for other files that might need fixing
  const filesToCheck = ['index.ts', 'index.js', 'browser.ts'];
  filesToCheck.forEach((filename) => {
    const filePath = path.join(GENERATED_DIR, filename);
    fixImportsInFile(filePath);
  });

  console.log('Done!');
}

main();
