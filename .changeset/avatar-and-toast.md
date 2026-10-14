---
"@gnoud-ui/react": minor
---

Add Avatar and Toast. Avatar (with `AvatarGroup`, which can fold the rest into a "+N" avatar, and an `initialsOf` helper) falls back to initials when the picture is missing or fails to load, and is named for screen readers either way. Toast (`ToastProvider` and the `useToast` hook, including `promise()` for loading, success and error) is announced to screen readers, reachable with F6, pauses on hover and focus, and dismisses by swipe. The library now has 20 components.
