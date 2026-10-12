# Changesets

Every change to `@gnoud-ui/react` that users should know about gets a changeset:

```bash
npm run changeset
```

Pick the bump (patch for fixes, minor for new things, major for breaking changes) and write a
sentence for the changelog. Commit the generated file with your change. When it reaches `main`,
the release workflow opens a "Version Packages" pull request; merging that publishes to npm.
