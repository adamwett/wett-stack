- Building fails with `length of undefined` error.
  - Run `pnpm clean` and try again.

- TS not finding modules or config files
  - make sure you run `pnpm i` after changing dependencies to update the
    symlinks

- TS not building
  - remember you need to specifiy the files to include/exclude in each
    individual tsconfig since the paths are not relative
