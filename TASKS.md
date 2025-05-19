# Project Tasks

This document explains the task system in our project, which uses Turborepo for
managing and running tasks across our monorepo.

## Task Types

### Global Tasks

These tasks can be run across all packages in the project:

- `build` - Builds all packages
- `dev` - Starts development servers
- `clean` - Cleans build artifacts
- `typecheck` - Runs TypeScript type checking
- `lint` - Runs Biome linter
- `lint:fix` - Runs Biome linter with auto-fix

### Package-Specific Tasks

These tasks are scoped to specific packages:

#### Database Tasks

- `db:push` - Push database schema changes
- `db:studio` - Open database studio

#### Wrangler Tasks

- `wrangler:dev` - Start Wrangler development server
- `wrangler:apply` - Apply Wrangler migrations

#### UI Tasks

- `ui-add` - Add new UI components

## Running Tasks

### Basic Usage

```bash
# Run a task across all packages
pnpm build

# Run a task in a specific package
pnpm db:push
```

### Task Dependencies

Some tasks automatically run their dependencies:

- `build` runs `^build` (builds dependencies first)
- `dev` runs `^dev` (starts dependency dev servers)
- `typecheck` runs `^build` (builds dependencies first)

### Task Configuration

Tasks are configured in `turbo.json` with the following properties:

- `dependsOn`: Tasks that must run before this task
- `cache`: Whether to cache task results
- `persistent`: Whether the task is long-running
- `interactive`: Whether the task requires user input
- `outputs`: Files that should be cached
- `env`: Environment variables required by the task

## Environment Variables

### Global Environment Variables

These are available to all tasks:

- `NODE_ENV`
- `CI`
- `npm_lifecycle_event`

### Package-Specific Environment Variables

Some tasks require specific environment variables:

- `push` requires `DB_POSTGRES_URL`

## Task Caching

Tasks can be cached to improve performance:

- Build outputs are cached in `dist/**`
- TypeScript build info is cached in `.cache/tsbuildinfo.json`

## Development Workflow

1. Start development:
   ```bash
   pnpm dev
   ```

2. Make changes and test:
   ```bash
   pnpm typecheck
   pnpm lint
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

## Adding New Tasks

To add a new task:

1. Add the script to the appropriate package's `package.json`
2. Add the task configuration to `turbo.json`
3. Add a root-level script in the root `package.json` if needed

Example for a new Wrangler task:

```json
// tools/wrangler/package.json
{
  "scripts": {
    "new-task": "wrangler command"
  }
}

// turbo.json
{
  "tasks": {
    "new-task": {
      "cache": false,
      "interactive": true
    }
  }
}

// package.json
{
  "scripts": {
    "wrangler:new-task": "turbo -F @repo/wrangler-config new-task"
  }
}
```

## Best Practices

1. Use consistent naming conventions:
   - Package-specific tasks should be prefixed (e.g., `wrangler:`, `db:`)
   - Global tasks should be simple and clear

2. Configure caching appropriately:
   - Enable caching for build tasks
   - Disable caching for interactive tasks

3. Use task dependencies to ensure correct execution order

4. Document new tasks in this file

5. Use environment variables for configuration

## Troubleshooting

If tasks aren't running as expected:

1. Check the task configuration in `turbo.json`
2. Verify the script exists in the package's `package.json`
3. Check for required environment variables
4. Clear the cache if needed: `pnpm clean`
