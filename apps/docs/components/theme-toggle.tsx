"use client";

import { Button } from "@gnoud-ui/react";
import { useSyncExternalStore } from "react";

type Theme = "system" | "light" | "dark";

const KEY = "gu-theme";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Theme {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function setTheme(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
  } catch {
    // Storage can be unavailable (private mode). The choice still applies for this page view.
  }
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  listeners.forEach((listener) => listener());
}

const options: { value: Theme; label: string }[] = [
  { value: "system", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function ThemeToggle() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => "system" as Theme);

  return (
    <div role="group" aria-label="Colour theme" className="flex gap-1">
      {options.map(({ value, label }) => (
        <Button
          key={value}
          size="sm"
          variant={current === value ? "secondary" : "ghost"}
          aria-pressed={current === value}
          onClick={() => setTheme(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
