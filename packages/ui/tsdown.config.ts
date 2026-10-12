import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  platform: "neutral",
  dts: true,
  // One output file per source file, so bundlers can tree-shake per component
  // and each file keeps its own "use client" directive.
  unbundle: true,
  clean: true,
  sourcemap: true,
  css: {
    fileName: "styles.css",
    splitting: false,
    minify: true,
  },
  // Types for the "./styles.css" subpath export; see src/styles/styles.d.ts.
  copy: [{ from: "src/styles/styles.d.ts", to: "dist" }],
  // Fail the build if the published package is mis-wired (exports, types, ESM resolution).
  publint: { level: "error" },
  attw: {
    profile: "esm-only",
    level: "error",
    // CSS is not a JS module, so there is nothing for attw to resolve.
    excludeEntrypoints: ["./styles.css"],
  },
  inputOptions: {
    // Rolldown warns that "use client" may not survive bundling. In unbundle mode it does
    // survive (verified in dist), so the warning is noise.
    onLog(level, log, handler) {
      if (log.code === "MODULE_LEVEL_DIRECTIVE") return;
      handler(level, log);
    },
  },
});
