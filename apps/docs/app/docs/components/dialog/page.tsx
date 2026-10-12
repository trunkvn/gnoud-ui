import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/dialog");

const rows = [
  ["Dialog open / defaultOpen / onOpenChange", "-", "closed", "Open it uncontrolled, or control it from state."],
  ["Dialog modal", "boolean | \"trap-focus\"", "true", "Modal blocks the page behind it and traps focus."],
  ["Dialog disablePointerDismissal", "boolean", "false", "Stop clicks on the veil from closing it."],
  ["DialogTrigger render", "ReactElement", "<button>", "Use your own button: render={<Button />}."],
  ["DialogContent showClose", "boolean", "true", "The corner × button. Keep it for touch screen reader users."],
  ["DialogContent initialFocus / finalFocus", "-", "-", "Choose which element gets focus on open / on close."],
  ["DialogTitle", "-", "required", "The dialog's accessible name."],
  ["DialogDescription", "-", "recommended", "The dialog's accessible description."],
] as const;

export default function DialogPage() {
  return (
    <>
      <PageHeader href="/docs/components/dialog" eyebrow="Component · 11" title="Dialog">
        A modal panel on a flat veil, with a hard shadow and a stamp-like drop in. Built on Base
        UI, so focus is trapped, Escape closes it, and focus returns to the trigger.
      </PageHeader>

      <Example
        title="Confirm"
        description="Always give it a title and a description: they name it for screen readers."
        code={`<Dialog>
  <DialogTrigger render={<Button />}>Delete project</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete project?</DialogTitle>
      <DialogDescription>
        This permanently removes the project and its files. This cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
      <DialogClose render={<Button variant="primary" />}>Delete</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
      >
        <Dialog>
          <DialogTrigger render={<Button />}>Delete project</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete project?</DialogTitle>
              <DialogDescription>
                This permanently removes the project and its files. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
              <DialogClose render={<Button variant="primary" />}>Delete</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Example>

      <Example
        title="With a form"
        description="Focus lands on the first field. Any content works inside."
        code={`<Dialog>
  <DialogTrigger render={<Button variant="primary" />}>Invite</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Invite a teammate</DialogTitle>
      <DialogDescription>They will get an email with a link to join.</DialogDescription>
    </DialogHeader>
    <label>
      Email
      <Input type="email" placeholder="name@company.com" />
    </label>
    <DialogFooter>
      <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
      <Button variant="primary">Send invite</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
      >
        <Dialog>
          <DialogTrigger render={<Button variant="primary" />}>Invite</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a teammate</DialogTitle>
              <DialogDescription>They will get an email with a link to join.</DialogDescription>
            </DialogHeader>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium">Email</span>
              <Input type="email" placeholder="name@company.com" />
            </label>
            <DialogFooter>
              <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
              <Button variant="primary">Send invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Example>

      <PropsTable rows={rows} />
      <div className="prose-gu mt-6">
        <div className="note">
          <p>
            Dialogs render in a portal at the end of <code>&lt;body&gt;</code>. If your app root
            creates its own stacking context, add <code>isolation: isolate</code> to it so the
            dialog always sits on top. The layers use <code>--gu-z-overlay</code> and{" "}
            <code>--gu-z-popup</code>.
          </p>
        </div>
      </div>
    </>
  );
}
