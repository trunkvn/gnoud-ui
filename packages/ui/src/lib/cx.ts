type ClassValue = string | false | null | undefined;

/** Join class names, dropping falsy values. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
