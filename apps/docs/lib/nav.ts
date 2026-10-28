export interface NavItem {
  title: string;
  href: string;
  /** One sentence, written for search results and link previews (about 100-160 characters). */
  description: string;
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
      { title: "Getting started", href: "/docs/getting-started", description:
        "Install @gnoud-ui/react, import one stylesheet and use accessible components in Next.js, Vite or any React 19 app. Works with Tailwind and Server Components." },
      { title: "Theming", href: "/docs/theming", description:
        "Customise gnoud-ui with CSS variables: light and dark themes, brand colours, radii, shadows and per-component overrides, with no theme provider." },
      { title: "Design tokens", href: "/docs/tokens", description:
        "The design token reference: light and dark colours, type scale, spacing, shape, print shadows, motion and layers, generated from the library's CSS." },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Accordion", href: "/docs/components/accordion", description:
        "Stacked sections that open and close, one at a time or several. Each header is a real button inside a heading. Built on Base UI." },
      { title: "Alert", href: "/docs/components/alert", description:
        "An inline message set like a margin note, with info, success, warning and danger variants and the right live-region role for each." },
      { title: "Avatar", href: "/docs/components/avatar", description:
        "A person's picture that falls back to their initials when the image is missing or fails to load. Named for screen readers. Built on Base UI." },
      { title: "Badge", href: "/docs/components/badge", description:
        "A small stamped label in five variants: static text in the same tracked uppercase as every eyebrow in the system." },
      { title: "Button", href: "/docs/components/button", description:
        "A native button that lifts on hover and sinks on press, with variants, sizes, loading and disabled states, and a render prop to become a link." },
      { title: "Card", href: "/docs/components/card", description:
        "A printed panel built from small parts: header, label, title, description, content and footer. Raised with a hard shadow, or flat." },
      { title: "Checkbox", href: "/docs/components/checkbox", description:
        "An accessible checkbox built on Base UI, with a mixed state, form support and an optional label that wraps the control." },
      { title: "Dialog", href: "/docs/components/dialog", description:
        "A modal dialog on a flat veil with a hard shadow. Traps focus, closes with Escape and returns focus to its trigger. Built on Base UI." },
      { title: "Input", href: "/docs/components/input", description:
        "A flat, ruled text field on a plain input element, with sizes, an invalid state and full support for browser autofill and forms." },
      { title: "Menu", href: "/docs/components/menu", description:
        "A dropdown list of actions with checkbox and radio items, groups and links. Arrow keys, typeahead and Escape. Built on Base UI." },
      { title: "Meter", href: "/docs/components/meter", description:
        "A gauge for a value within a known range, such as disk space. Not about finishing work: that is Progress. Announced as a meter." },
      { title: "Popover", href: "/docs/components/popover", description:
        "A floating panel anchored to a button, for extra content or a small form. Closes on Escape or an outside click. Built on Base UI." },
      { title: "Progress", href: "/docs/components/progress", description:
        "A bar for work with a measurable end, or a moving block when the length is unknown. Announced as a progressbar. Built on Base UI." },
      { title: "Radio", href: "/docs/components/radio", description:
        "Radio buttons for choosing exactly one option, in a group with arrow-key navigation. Round, so it never reads as a checkbox. Built on Base UI." },
      { title: "Select", href: "/docs/components/select", description:
        "Pick one value from a list: a flat trigger, a raised list with highlighted items, groups, typeahead and form submission. Built on Base UI." },
      { title: "Separator", href: "/docs/components/separator", description:
        "A thin ruled line between groups of content, horizontal or vertical, exposed as a separator to assistive technology. Built on Base UI." },
      { title: "Skeleton", href: "/docs/components/skeleton", description:
        "A hatched placeholder for content that is still loading. Decorative and hidden from screen readers; pairs with aria-busy on its container." },
      { title: "Slider", href: "/docs/components/slider", description:
        "Pick a number or a range by dragging a block along a ruled line or with the arrow keys. Submits with forms. Built on Base UI." },
      { title: "Switch", href: "/docs/components/switch", description:
        "A switch for settings that apply immediately: a block of ink slides across the track. Built on Base UI with full keyboard support." },
      { title: "Tabs", href: "/docs/components/tabs", description:
        "Accessible tabs with roving focus and arrow-key navigation, horizontal or vertical. The selected tab is inked in. Built on Base UI." },
      { title: "Textarea", href: "/docs/components/textarea", description:
        "The multi-line sibling of Input: flat, ruled, resizable, with an invalid state and the same labelling rules." },
      { title: "Toast", href: "/docs/components/toast", description:
        "Short messages that appear in a corner and go away by themselves, announced to screen readers and reachable with F6. Built on Base UI." },
      { title: "Toggle", href: "/docs/components/toggle", description:
        "A button that stays pressed, singly or grouped into one strip to pick one or many options. Exposed with aria-pressed. Built on Base UI." },
      { title: "Tooltip", href: "/docs/components/tooltip", description:
        "A short visual hint that opens on hover and keyboard focus and closes with Escape. Built on Base UI. Not announced to screen readers." },
    ],
  },
];

export const flatNav = nav.flatMap((section) => section.items);

/** The section ("Guide" or "Components") a page belongs to. */
export function sectionOf(href: string): string | undefined {
  return nav.find((section) => section.items.some((item) => item.href === href))?.title;
}

export function findPage(href: string): NavItem | undefined {
  return flatNav.find((item) => item.href === href);
}
