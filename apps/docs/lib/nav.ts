export interface NavItem {
  title: string;
  href: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/** The single source of truth for the sidebar, the mobile menu and the prev/next pager. */
export const nav: NavSection[] = [
  {
    title: "Guide",
    items: [
      { title: "Getting started", href: "/docs/getting-started" },
      { title: "Theming", href: "/docs/theming" },
      { title: "Design tokens", href: "/docs/tokens" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Alert", href: "/docs/components/alert" },
      { title: "Badge", href: "/docs/components/badge" },
      { title: "Button", href: "/docs/components/button" },
      { title: "Card", href: "/docs/components/card" },
      { title: "Checkbox", href: "/docs/components/checkbox" },
      { title: "Dialog", href: "/docs/components/dialog" },
      { title: "Input", href: "/docs/components/input" },
      { title: "Select", href: "/docs/components/select" },
      { title: "Switch", href: "/docs/components/switch" },
      { title: "Tabs", href: "/docs/components/tabs" },
      { title: "Textarea", href: "/docs/components/textarea" },
      { title: "Tooltip", href: "/docs/components/tooltip" },
    ],
  },
];

export const flatNav = nav.flatMap((section) => section.items);
