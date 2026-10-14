import { Avatar, AvatarGroup } from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/avatar");

// A self-contained picture, so the example needs no network.
const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#2b3f8f"/><circle cx="32" cy="25" r="11" fill="#f3eee3"/><path d="M10 64c2-14 12-22 22-22s20 8 22 22z" fill="#f3eee3"/></svg>',
  );

const rows = [
  ["alt", "string", "required", "The name. It is the avatar's accessible name whether or not the picture loads."],
  ["src", "string", "-", "The picture. Missing or failing to load shows the initials."],
  ["fallback", "string", "from alt", "Initials to show instead. By default the first letters of the first and last words of alt."],
  ["size", '"sm" | "md" | "lg" | "xl"', '"md"', "2rem, 2.5rem, 3.5rem or 5rem."],
  ["shape", '"circle" | "square"', '"circle"', "Square uses the system's near-square corners."],
  ["decorative", "boolean", "false", "Hide it from assistive tech, when the name is already written beside it."],
  ["AvatarGroup max", "number", "all", "Show at most this many, then one \"+N\" avatar named \"N more\"."],
  ["AvatarGroup size / shape", "-", "-", "Defaults for every avatar in the group. An avatar's own size or shape wins."],
] as const;

export default function AvatarPage() {
  return (
    <>
      <PageHeader href="/docs/components/avatar" eyebrow="Component · 19" title="Avatar">
        A person&apos;s picture that never leaves a hole: if the image is missing or fails to load,
        their initials take its place. Flat and ruled, because an avatar is not something you press.
        Built on Base UI.
      </PageHeader>

      <Example
        title="Picture and initials"
        description="The first has a picture; the second has none; the third points at an image that does not exist, so it falls back too."
        code={`<Avatar alt="Ada Lovelace" src={picture} />
<Avatar alt="Nguyễn Đại Dương" />
<Avatar alt="Alan Turing" src="/missing.png" />`}
      >
        <Avatar alt="Ada Lovelace" src={picture} />
        <Avatar alt="Nguyễn Đại Dương" />
        <Avatar alt="Alan Turing" src="/missing.png" />
      </Example>

      <Example
        title="Sizes and shapes"
        code={`<Avatar alt="Ada Lovelace" size="sm" />
<Avatar alt="Ada Lovelace" size="md" />
<Avatar alt="Ada Lovelace" size="lg" />
<Avatar alt="Ada Lovelace" size="xl" shape="square" />`}
      >
        <Avatar alt="Ada Lovelace" size="sm" />
        <Avatar alt="Ada Lovelace" size="md" />
        <Avatar alt="Ada Lovelace" size="lg" />
        <Avatar alt="Ada Lovelace" size="xl" shape="square" />
      </Example>

      <Example
        title="A group"
        description="Overlapping, each cut out of the one beneath by a ring in the colour of what it sits on (set --gu-avatar-ring). Give the group a name that says who they are."
        code={`<AvatarGroup aria-label="Reviewers" style={{ "--gu-avatar-ring": "var(--gu-surface)" }}>
  <Avatar alt="Ada Lovelace" src={picture} />
  <Avatar alt="Alan Turing" />
  <Avatar alt="Grace Hopper" />
  <Avatar alt="3 more reviewers" fallback="+3" />
</AvatarGroup>`}
      >
        <AvatarGroup aria-label="Reviewers" style={{ "--gu-avatar-ring": "var(--gu-surface)" } as React.CSSProperties}>
          <Avatar alt="Ada Lovelace" src={picture} />
          <Avatar alt="Alan Turing" />
          <Avatar alt="Grace Hopper" />
          <Avatar alt="3 more reviewers" fallback="+3" />
        </AvatarGroup>
      </Example>

      <Example
        title="Folding the rest into a count"
        description="With max, the others become one avatar that says how many are left, and is named, for example, 3 more."
        code={`<AvatarGroup aria-label="Reviewers" max={3} size="lg">
  {people.map((name) => <Avatar key={name} alt={name} />)}
</AvatarGroup>`}
      >
        <AvatarGroup aria-label="Six reviewers" max={3} size="lg" style={{ "--gu-avatar-ring": "var(--gu-surface)" } as React.CSSProperties}>
          {["Ada Lovelace", "Alan Turing", "Grace Hopper", "Linus Torvalds", "Margaret Hamilton", "Dennis Ritchie"].map((name) => (
            <Avatar key={name} alt={name} />
          ))}
        </AvatarGroup>
      </Example>

      <Example
        title="Beside a name"
        description="When the name is already written next to it, mark the avatar decorative so it is not read twice."
        code={`<div className="flex items-center gap-3">
  <Avatar alt="Ada Lovelace" decorative />
  <span>Ada Lovelace</span>
</div>`}
      >
        <div className="flex items-center gap-3">
          <Avatar alt="Ada Lovelace" decorative />
          <span>Ada Lovelace</span>
        </div>
      </Example>

      <PropsTable rows={rows} />
      <p className="mt-3 text-sm text-muted">
        All other props of <span className="font-mono">&lt;span&gt;</span> are passed through. The
        helper <span className="font-mono">initialsOf(name)</span> is exported if you need the same
        initials elsewhere.
      </p>
    </>
  );
}
