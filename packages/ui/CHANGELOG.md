# @gnoud-ui/react

## 0.3.0

### Minor Changes

- e7fbab5: Add Avatar and Toast. Avatar (with `AvatarGroup`, which can fold the rest into a "+N" avatar, and an `initialsOf` helper) falls back to initials when the picture is missing or fails to load, and is named for screen readers either way. Toast (`ToastProvider` and the `useToast` hook, including `promise()` for loading, success and error) is announced to screen readers, reachable with F6, pauses on hover and focus, and dismisses by swipe. The library now has 20 components.

## 0.2.0

### Minor Changes

- 5e590ec: Add six components: Radio (RadioGroup + Radio), Accordion, Popover, Menu (with checkbox, radio, group and link items), Progress (determinate and indeterminate) and Skeleton. All are keyboard operable and covered by unit, accessibility and real-browser tests. The library now has 18 components.

## 0.1.1

### Patch Changes

- 92b1eed: Link the documentation site (https://gnoud-ui.vercel.app) from the package metadata and README.

## 0.1.0

### Minor Changes

- bd7b839: First release: 12 accessible React components (Alert, Badge, Button, Card, Checkbox, Dialog, Input, Select, Switch, Tabs, Textarea, Tooltip) with a paper-and-ink design language, light and dark themes, and design tokens as CSS custom properties. Styles ship as one stylesheet inside a cascade layer so your own CSS can override them.
