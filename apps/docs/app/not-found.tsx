import { Button } from "@gnoud-ui/react";
import Link from "next/link";
import { Label } from "@/components/example";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-6xl px-5 py-24">
      <Label>404</Label>
      <h1
        className="font-display text-[clamp(2.75rem,7vw,4.75rem)] font-bold"
        style={{ letterSpacing: "var(--gu-tracking-display)", lineHeight: "var(--gu-leading-tight)" }}
      >
        Nothing printed here.
      </h1>
      <p className="mt-5 max-w-[46ch] text-lg text-muted">
        That page does not exist, or it moved. Try the docs or the component list.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button variant="primary" render={<Link href="/docs/getting-started" />}>
          Read the docs
        </Button>
        <Button render={<Link href="/" />}>Go home</Button>
      </div>
    </main>
  );
}
