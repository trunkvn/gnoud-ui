import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@gnoud-ui/react";
import { Example, PageHeader, PropsTable } from "@/components/example";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/alert-dialog");

const rows = [
  ["AlertDialog open / defaultOpen / onOpenChange", "-", "closed", "Open it uncontrolled, or control it from state."],
  ["AlertDialogTrigger render", "ReactElement", "<button>", "Use your own button: render={<Button />}."],
  ["AlertDialogClose render", "ReactElement", "<button>", "Every choice closes the dialog. Run your work in its onClick."],
  ["AlertDialogContent initialFocus / finalFocus", "-", "-", "Choose which element gets focus on open / on close. Focus the safe choice."],
  ["AlertDialogTitle", "-", "required", "The dialog's accessible name."],
  ["AlertDialogDescription", "-", "required", "Says what will happen. It is the dialog's accessible description."],
] as const;

export default function AlertDialogPage() {
  return (
    <>
      <PageHeader href="/docs/components/alert-dialog" eyebrow="Component · 25" title="Alert dialog">
        A dialog that interrupts to ask for a decision, like confirming a deletion. It is announced
        as an alert dialog and a click on the veil does not dismiss it. Built on Base UI.
      </PageHeader>

      <Example
        title="Confirm a destructive action"
        description="The person has to choose. There is no corner × and the veil is inert; Escape still cancels."
        code={`<AlertDialog>
  <AlertDialogTrigger render={<Button />}>Delete account</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete your account?</AlertDialogTitle>
      <AlertDialogDescription>
        All your projects and data will be removed for good. This cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogClose render={<Button variant="ghost" />}>Keep account</AlertDialogClose>
      <AlertDialogClose render={<Button variant="primary" />} onClick={deleteAccount}>
        Delete account
      </AlertDialogClose>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
      >
        <AlertDialog>
          <AlertDialogTrigger render={<Button />}>Delete account</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                All your projects and data will be removed for good. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="ghost" />}>Keep account</AlertDialogClose>
              <AlertDialogClose render={<Button variant="primary" />}>Delete account</AlertDialogClose>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Example>

      <PropsTable rows={rows} />
      <div className="prose-gu mt-6">
        <div className="note">
          <p>
            Reach for a plain Dialog when the content is a form or something the person may want
            to dismiss. Use an alert dialog only when you need an answer before going on.
          </p>
        </div>
      </div>
    </>
  );
}
