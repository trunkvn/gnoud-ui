import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The home-screen icon on iOS: the logo (an indigo block on an ink shadow) on paper. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3eee3" }}>
        <div style={{ display: "flex", position: "relative", width: 112, height: 112 }}>
          <div style={{ position: "absolute", left: 18, top: 18, width: 90, height: 90, background: "#18150f" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 90, height: 90, background: "#2b3f8f", border: "6px solid #18150f" }} />
        </div>
      </div>
    ),
    size,
  );
}
