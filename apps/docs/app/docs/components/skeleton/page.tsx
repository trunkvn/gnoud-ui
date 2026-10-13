import { Card, Skeleton } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/skeleton");

const rows = [
  ["shape", '"block" | "circle"', '"block"', "Circle is for avatars."],
  ["width / height", "via style or className", "100% / 1rem", "Skeletons take their size from you, so the layout does not jump when content arrives."],
  ["aria-hidden", "boolean", "true", "It is decoration, so screen readers skip it."],
] as const;

export default function SkeletonPage() {
  return (
    <>
      <PageHeader href="/docs/components/skeleton" eyebrow="Component · 18" title="Skeleton">
        A placeholder for content that is still loading: unprinted paper, a hatch of hairlines that
        breathes. It is a plain element with no JavaScript, so it works in Server Components.
      </PageHeader>

      <Example
        title="A card that is loading"
        description="Give the container aria-busy so assistive tech knows the content is on its way."
        code={`<section aria-busy="true" aria-label="Profile">
  <Skeleton shape="circle" style={{ width: 48, height: 48 }} />
  <Skeleton style={{ width: "60%" }} />
  <Skeleton style={{ height: 12 }} />
  <Skeleton style={{ height: 12, width: "80%" }} />
</section>`}
      >
        <Card className="w-full max-w-sm">
          <section aria-busy="true" aria-label="Profile" className="grid gap-3">
            <div className="flex items-center gap-3">
              <Skeleton shape="circle" style={{ width: 48, height: 48 }} />
              <Skeleton style={{ width: "60%" }} />
            </div>
            <Skeleton style={{ height: 12 }} />
            <Skeleton style={{ height: 12, width: "80%" }} />
          </section>
        </Card>
      </Example>

      <Example
        title="Shapes"
        code={`<Skeleton shape="circle" />
<Skeleton style={{ width: 160, height: 24 }} />`}
      >
        <Skeleton shape="circle" />
        <Skeleton style={{ width: 160, height: 24 }} />
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        Skeletons suit content whose shape you know. For a task that just takes time, use Progress.
      </p>
    </>
  );
}
