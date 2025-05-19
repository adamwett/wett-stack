import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Run `wrangler types types/wrangler-original.d.ts` in a terminal
const inputFile = path.join(process.cwd(), 'types', 'wrangler.d.ts');
const outputFile = path.join(process.cwd(), 'types', 'wrangler.exported.d.ts');

// Run the command to generate the file
execSync(`wrangler types ${inputFile}`);

// Read the newly generated file
const generatedContent = fs.readFileSync(inputFile, 'utf8');

// Replace the export declarations with the new ones
const exportRegex = /^( *)(interface|type|enum|function) /gm;
const converted = generatedContent.replace(exportRegex, '$1export $2 ');

// If the exported file already exists, delete it
if (fs.existsSync(outputFile)) {
  fs.rmSync(outputFile);
}

// Output the converted file
fs.writeFileSync(outputFile, converted, 'utf8');
console.log(`Generated ${outputFile}`);
