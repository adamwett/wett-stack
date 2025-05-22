{
  "name": "@repo/REPLACE_ME",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsc --build",
    "clean": "git clean -xdf .cache .turbo dist node_modules",
    "dev": "tsc",
    "typecheck": "tsc --noEmit --emitDeclarationOnly false",
    "lint": "biome check .",
    "fix": "biome check --write ."
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "typescript": "catalog:"
  },
}
