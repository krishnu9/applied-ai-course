type ClassValue = string | false | null | undefined;

/** Join truthy class strings into one class list. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
