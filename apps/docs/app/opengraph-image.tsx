import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "gnoud-ui: interfaces that feel printed";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f3eee3";
const INK = "#18150f";
const ACCENT = "#2b3f8f";
const MUTED = "#625c4f";

// ImageResponse only ships a regular-weight font, so load the site's heading font (OFL, see assets/).
const heading = await readFile(join(process.cwd(), "assets/FamiljenGrotesk-Bold.ttf"));

export default function Image() {
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
          {/* the logo: an indigo block stamped on an ink shadow */}
          <div style={{ display: "flex", position: "relative", width: 84, height: 84 }}>
            <div style={{ position: "absolute", left: 12, top: 12, width: 66, height: 66, background: INK }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 66,
                height: 66,
                background: ACCENT,
                border: `4px solid ${INK}`,
              }}
            />
          </div>
          <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: -1 }}>gnoud-ui</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1.02, letterSpacing: -4 }}>
            Interfaces that feel printed.
          </div>
          <div style={{ fontSize: 34, color: MUTED }}>
            React components · hard shadows · light and dark
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: MUTED }}>
          <div>npm install @gnoud-ui/react</div>
          <div>gnoud-ui.vercel.app</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Familjen Grotesk", data: heading, weight: 700, style: "normal" }],
    },
  );
}
