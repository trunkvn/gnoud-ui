import { renderOg } from "@/lib/og";

/** The home page's share image: /og */
export function GET() {
  return renderOg({ title: "Interfaces that feel printed.", description: "React components · hard shadows · light and dark" });
}
