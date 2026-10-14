import { Example, PageHeader, PropsTable } from "@/components/example";
import { ToastDemo } from "@/components/toast-demo";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/docs/components/toast");

const rows = [
  ["ToastProvider position", '"top-left" | "top-right" | "bottom-left" | "bottom-right"', '"bottom-right"', "Where the stack sits."],
  ["ToastProvider limit", "number", "3", "Most toasts on screen at once. Older ones wait out of sight."],
  ["ToastProvider timeout", "number", "5000", "Default milliseconds before a toast dismisses itself. 0 keeps it."],
  ["ToastProvider label", "string", '"Notifications"', "The region's name for screen readers."],
  ["useToast().add(options)", "ToastOptions → id", "-", "Show a toast. Returns its id."],
  ["useToast().close(id?)", "(id?) => void", "-", "Dismiss one toast, or all of them with no id."],
  ["options.title / description", "ReactNode", "-", "The message. Keep it short."],
  ["options.variant", '"info" | "success" | "warning" | "danger"', '"info"', "The coloured rule. The words must carry the meaning."],
  ["options.timeout", "number", "provider's", "Milliseconds before it goes. 0 keeps it until dismissed."],
  ["options.priority", '"low" | "high"', "danger: high", "High is announced to screen readers at once; low politely when they are idle."],
  ["options.action", "{ label, onClick }", "-", "One button on the toast, for example Undo."],
  ["options.id", "string", "auto", "Reusing an id updates that toast instead of adding another."],
  ["useToast().promise(promise, messages)", "Promise<T>", "-", "Follow a promise: loading, then success or error. Returns the promise, so you can still await or catch it."],
  ["messages.loading / success / error", "text, options, or (value) => text | options", "-", "What each stage says. Each can carry its own variant and timeout. An error is shown as danger and announced at once."],
] as const;

const setup = `// app/layout.tsx: once, near the root
import { ToastProvider } from "@gnoud-ui/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}`;

export default function ToastPage() {
  return (
    <>
      <PageHeader href="/docs/components/toast" eyebrow="Component · 20" title="Toast">
        Short messages that arrive in a corner and leave by themselves. Raised cards with a coloured
        rule, announced to screen readers, paused while you hover or focus them, and dismissible by
        swipe. Built on Base UI.
      </PageHeader>

      <Example
        title="Set up once, use anywhere"
        description="Put one ToastProvider near the root. Then call useToast() from any component inside it (it must be a client component)."
        code={`${setup}

// anywhere below it
"use client";
import { Button, useToast } from "@gnoud-ui/react";

function SaveButton() {
  const toast = useToast();
  return (
    <Button onClick={() => toast.add({ title: "Saved", description: "Your changes are live." })}>
      Save
    </Button>
  );
}`}
      >
        <ToastDemo kind="basics" />
      </Example>

      <Example
        title="Variants"
        description="Danger is announced to screen readers at once; the others wait until they are idle."
        code={`toast.add({ variant: "success", title: "Uploaded", description: "report.pdf is ready." });
toast.add({ variant: "danger", title: "Payment failed", description: "Your card was declined." });`}
      >
        <ToastDemo kind="variants" />
      </Example>

      <Example
        title="With an action"
        description="One button, for the thing a person would want straight away. It keeps the toast on screen a little longer."
        code={`toast.add({
  title: "Message deleted",
  timeout: 8000,
  action: { label: "Undo", onClick: restore },
});`}
      >
        <ToastDemo kind="action" />
      </Example>

      <Example
        title="Stay until dismissed, or go quickly"
        description="timeout: 0 keeps it. Use that for things a person must not miss, and give them a way to close it."
        code={`toast.add({ title: "Connection lost", timeout: 0 });
toast.add({ title: "Quick one", timeout: 1500 });`}
      >
        <ToastDemo kind="persistent" />
        <ToastDemo kind="quick" />
      </Example>

      <Example
        title="Follow a promise"
        description="One toast that says what is happening, then what happened. It stays while the work is pending, and only starts counting down once it is done."
        code={`toast.promise(save(draft), {
  loading: "Saving draft…",
  success: (name) => ({ title: \`Saved \${name}\`, description: "Your draft is safe." }),
  error: (error) => ({ title: "Could not save", description: error.message }),
});`}
      >
        <ToastDemo kind="promise" />
      </Example>

      <PropsTable rows={rows} />
      <div className="prose-gu mt-6">
        <div className="note">
          <p>
            <strong>Keyboard and screen readers:</strong> press <code>F6</code> to move focus to the
            notifications region, then Tab through the toasts. A toast pauses its countdown while it is
            hovered or focused. Because a toast disappears, never put the only copy of important
            information in one: also show it where the person can find it again.
          </p>
        </div>
      </div>
    </>
  );
}
