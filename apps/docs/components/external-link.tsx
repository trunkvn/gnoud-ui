import type { ComponentPropsWithoutRef } from "react";

/** A link to another site. The arrow is decoration, so it is hidden from screen readers. */
export function ExternalLink({ children, ...props }: Omit<ComponentPropsWithoutRef<"a">, "target" | "rel">) {
  return (
    <a {...props} rel="noopener noreferrer">
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}
