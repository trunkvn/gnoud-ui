# gnoud-ui

A React component library with a paper-and-ink design language, built as a monorepo: the
publishable package and the documentation site that is also its test bench.

| Path | What it is |
|---|---|
| [`packages/ui`](packages/ui) | `@gnoud-ui/react`: the npm package (18 components, design tokens, one stylesheet) |
| [`apps/docs`](apps/docs) | The docs site (Next.js): guides, a page per component, a token reference |

**Live docs: [gnoud-ui.vercel.app](https://gnoud-ui.vercel.app)** · [npm](https://www.npmjs.com/package/@gnoud-ui/react)

See the [package README](packages/ui/README.md) for installation and usage.

## Design

Warm paper, near-black ink, one indigo accent. Things you can press are raised with a hard offset
shadow and sink into the page when pressed; fields and text stay flat. No blur anywhere. The
rules live in the design tokens, so changing them changes the whole system.

## Develop

Requires Node 22.18+ or 24.11+ (see `.nvmrc`).

```bash
npm install
npm run dev        # library in watch mode + docs at http://localhost:3000
```

```bash
npm run typecheck  # all packages
npm run lint
npm run test       # unit and accessibility tests (Vitest, jsdom, axe)
npm run build      # builds the package (with publint and attw checks), then the docs
npm run e2e        # real-browser tests (Playwright); builds first
```

Each component lives in `packages/ui/src/components/<name>/`: a `.tsx`, a `<name>.styles.css`
(name it `.styles.css`, not `.css`, or the build renames the output), and a test. Export it from
`packages/ui/src/index.ts` and add a docs page under `apps/docs/app/docs/components/`.

## Release

Releases use [Changesets](https://github.com/changesets/changesets).

1. Make your change and run `npm run changeset`; commit the generated file.
2. When it lands on `main`, the **Release** workflow opens a "Version Packages" pull request.
3. Merging that pull request publishes `@gnoud-ui/react` to npm.

Publishing needs an `NPM_TOKEN` repository secret (see the workflow for details).

## License

MIT © gnoud
