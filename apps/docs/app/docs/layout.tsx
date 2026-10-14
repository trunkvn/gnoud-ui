import { ToastProvider } from "@gnoud-ui/react";
import { DocsNav } from "@/components/docs-nav";
import { Pager } from "@/components/pager";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-10 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] no-scrollbar overflow-y-auto pr-2">
          <DocsNav />
        </div>
      </aside>
      <main id="main" className="min-w-0 max-w-3xl">
        {/* One provider near the root, as recommended: the Toast examples use it. */}
        <ToastProvider>{children}</ToastProvider>
        <Pager />
      </main>
    </div>
  );
}
