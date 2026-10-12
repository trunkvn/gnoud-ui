import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { OG_SIZE } from "./metadata";
import { SITE_URL } from "./site";

const PAPER = "#f3eee3";
const INK = "#18150f";
const ACCENT = "#2b3f8f";
const MUTED = "#625c4f";

// ImageResponse only ships a regular-weight font, so load the site's heading font (OFL, see assets/).
const heading = readFile(join(process.cwd(), "assets/FamiljenGrotesk-Bold.ttf"));

function Logo() {
  return (
    <div style={{ display: "flex", position: "relative", width: 84, height: 84 }}>
      <div style={{ position: "absolute", left: 12, top: 12, width: 66, height: 66, background: INK }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 66, height: 66, background: ACCENT, border: `4px solid ${INK}` }} />
    </div>
  );
}

interface OgProps {
  /** Small uppercase line above the title, e.g. "Component". Omit for the home image. */
  eyebrow?: string;
  title: string;
  description?: string;
}

/** The 1200x630 share image. With an eyebrow it is a page card; without, the home card. */
export async function renderOg({ eyebrow, title, description }: OgProps) {
  const isHome = !eyebrow;
  const titleSize = isHome ? 120 : 112;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: 72,
          fontFamily: "Familjen Grotesk",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Logo />
          <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: -1 }}>gnoud-ui</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {eyebrow && <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: ACCENT }}>{eyebrow}</div>}
          <div style={{ fontSize: titleSize, fontWeight: 700, lineHeight: 1.02, letterSpacing: -4 }}>{title}</div>
          {description && <div style={{ fontSize: isHome ? 34 : 28, lineHeight: 1.35, color: MUTED, maxWidth: 1056 }}>{description}</div>}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: MUTED }}>
          <div>npm install @gnoud-ui/react</div>
          <div>{SITE_URL.replace("https://", "")}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Familjen Grotesk", data: await heading, weight: 700, style: "normal" }] },
  );
}
