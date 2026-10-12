// Smoke test for the PUBLISHED shape of the package.
//
// Workspace links hide packaging mistakes (a file missing from `files`, a wrong `exports`
// path, a dependency that is only present in the monorepo). So: pack it, install the tarball
// into an empty project the way a user would, and use it.
//
// Run after `npm run build`:  npm run smoke   (needs network to install dependencies)

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const work = mkdtempSync(join(tmpdir(), "gnoud-smoke-"));
const failures = [];
const check = (ok, message) => {
  console.log(`${ok ? "ok  " : "FAIL"}  ${message}`);
  if (!ok) failures.push(message);
};
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

// ---- 1. what goes into the tarball
const packed = JSON.parse(run("npm", ["pack", "--json", "--pack-destination", work], pkgDir))[0];
const files = packed.files.map((f) => f.path);
for (const required of ["package.json", "README.md", "LICENSE", "dist/index.js", "dist/index.d.ts", "dist/styles.css", "dist/styles.d.ts"])
  check(files.includes(required), `tarball contains ${required}`);
check(!files.some((f) => f.startsWith("src/") || f.startsWith("test/") || f.endsWith(".test.js")), "tarball has no sources or tests");
console.log(`      ${files.length} files, ${(packed.size / 1024).toFixed(1)} kB packed, ${(packed.unpackedSize / 1024).toFixed(1)} kB unpacked`);

// ---- 2. install it like a user
const app = join(work, "app");
execFileSync("mkdir", ["-p", app]);
writeFileSync(join(app, "package.json"), JSON.stringify({ name: "smoke-app", private: true, type: "module" }));
run("npm", ["install", join(work, packed.filename), "react@19", "react-dom@19", "typescript", "@types/react@19", "@types/react-dom@19", "@types/node"], app);
check(true, "tarball installs with its dependencies from the registry");

// ---- 3. runtime: same exports as the local build, and everything renders on the server
const local = Object.keys(await import(pathToFileURL(join(pkgDir, "dist/index.js")).href)).sort();
writeFileSync(join(app, "ssr.mjs"), `
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import * as UI from "@gnoud-ui/react";

const exportsList = Object.keys(UI).sort();
console.log("EXPORTS " + JSON.stringify(exportsList));

const html = (el) => renderToString(el);
const cases = {
  Alert: () => h(UI.Alert, { variant: "danger" }, h(UI.AlertTitle, null, "t"), h(UI.AlertDescription, null, "d")),
  Badge: () => h(UI.Badge, { variant: "accent" }, "New"),
  Button: () => h(UI.Button, { variant: "primary", size: "lg", loading: true }, "Go"),
  Card: () => h(UI.Card, null, h(UI.CardHeader, null, h(UI.CardLabel, null, "l"), h(UI.CardTitle, null, "t"), h(UI.CardDescription, null, "d")), h(UI.CardContent, null, "c"), h(UI.CardFooter, null, "f")),
  Checkbox: () => h(UI.Checkbox, { label: "Remember me", defaultChecked: true }),
  Dialog: () => h(UI.Dialog, null, h(UI.DialogTrigger, null, "Open"), h(UI.DialogContent, null, h(UI.DialogTitle, null, "t"))),
  Input: () => h(UI.Input, { invalid: true, "aria-label": "x" }),
  Select: () => h(UI.Select, { items: [{ label: "A", value: "a" }] }, h(UI.SelectTrigger, { "aria-label": "x" }, h(UI.SelectValue, { placeholder: "Pick" })), h(UI.SelectContent, null, h(UI.SelectItem, { value: "a" }, "A"))),
  Switch: () => h(UI.Switch, { label: "On" }),
  Tabs: () => h(UI.Tabs, { defaultValue: "a" }, h(UI.TabsList, null, h(UI.TabsTab, { value: "a" }, "A")), h(UI.TabsPanel, { value: "a" }, "pa")),
  Textarea: () => h(UI.Textarea, { "aria-label": "x" }),
  Tooltip: () => h(UI.Tooltip, { content: "Hi" }, h(UI.Button, null, "Hover")),
};
let failed = 0;
for (const [name, make] of Object.entries(cases)) {
  try {
    const out = html(make());
    if (!out || out.length < 10) throw new Error("rendered nothing");
    console.log("RENDER ok " + name);
  } catch (e) {
    failed++;
    console.log("RENDER FAIL " + name + ": " + e.message);
  }
}
process.exit(failed ? 1 : 0);
`);
let ssrOut = "";
try {
  ssrOut = run("node", ["ssr.mjs"], app);
} catch (e) {
  ssrOut = (e.stdout ?? "") + (e.stderr ?? "");
}
const installed = JSON.parse((ssrOut.match(/^EXPORTS (.*)$/m) ?? [, "[]"])[1]);
check(JSON.stringify(installed) === JSON.stringify(local), `installed package exports the same ${local.length} names as the local build`);
if (JSON.stringify(installed) !== JSON.stringify(local))
  console.log("      only local:", local.filter((n) => !installed.includes(n)), "only installed:", installed.filter((n) => !local.includes(n)));
for (const line of ssrOut.split("\n").filter((l) => l.startsWith("RENDER"))) check(line.startsWith("RENDER ok"), `server-renders: ${line.replace(/^RENDER (ok )?/, "")}`);
check(!/RENDER FAIL/.test(ssrOut) && /RENDER ok/.test(ssrOut), "every component family server-renders without throwing");

const css = run("node", ["-e", "const fs=require('fs');const p=require.resolve('@gnoud-ui/react/styles.css');console.log(fs.readFileSync(p,'utf8'))"], app);
check(css.includes("@layer gnoud-ui"), "styles.css resolves through exports and declares the gnoud-ui layer");
check(css.includes("--gu-accent") && css.includes(".gu-button") && css.includes(".gu-dialog"), "styles.css carries the tokens and component styles");

// ---- 4. types: a consumer's TypeScript accepts the API (both common resolution modes)
writeFileSync(join(app, "check.tsx"), `
import "@gnoud-ui/react/styles.css";
import { Button, Card, CardTitle, Checkbox, Dialog, DialogContent, DialogTitle, DialogTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Tabs, TabsList, TabsPanel, TabsTab, Tooltip } from "@gnoud-ui/react";
import type { ButtonProps, InputProps } from "@gnoud-ui/react";

const buttonProps: ButtonProps = { variant: "primary", size: "sm", loading: false };
const inputProps: InputProps = { size: "lg", invalid: true, type: "email" };

export const tree = (
  <Card variant="flat">
    <CardTitle as="h2">Hi</CardTitle>
    <Button {...buttonProps} onClick={(e) => e.currentTarget.blur()}>Go</Button>
    <Button render={<a href="/x" />}>Link</Button>
    <Input {...inputProps} />
    <Checkbox label="x" onCheckedChange={(checked: boolean) => void checked} />
    <Switch aria-label="x" />
    <Select items={[{ label: "A", value: "a" }]} onValueChange={(v) => void v}>
      <SelectTrigger><SelectValue placeholder="x" /></SelectTrigger>
      <SelectContent><SelectItem value="a">A</SelectItem></SelectContent>
    </Select>
    <Tabs defaultValue="a"><TabsList><TabsTab value="a">A</TabsTab></TabsList><TabsPanel value="a">p</TabsPanel></Tabs>
    <Dialog><DialogTrigger render={<Button />}>Open</DialogTrigger><DialogContent><DialogTitle>t</DialogTitle></DialogContent></Dialog>
    <Tooltip content="hi"><Button>x</Button></Tooltip>
  </Card>
);

// @ts-expect-error variant must be one of the known values
export const bad = <Button variant="rainbow" />;
`);
for (const [module, resolution] of [["nodenext", "nodenext"], ["esnext", "bundler"]]) {
  writeFileSync(join(app, "tsconfig.json"), JSON.stringify({ compilerOptions: { module, moduleResolution: resolution, jsx: "react-jsx", strict: true, noEmit: true, types: ["node"] }, files: ["check.tsx"] }));
  try {
    run("npx", ["tsc", "-p", "."], app);
    check(true, `consumer typechecks (moduleResolution: ${resolution})`);
  } catch (e) {
    check(false, `consumer typechecks (moduleResolution: ${resolution})\n${e.stdout ?? ""}`);
  }
}

console.log(failures.length ? `\n${failures.length} check(s) failed (kept ${work})` : "\npackage smoke test passed");
process.exit(failures.length ? 1 : 0);
