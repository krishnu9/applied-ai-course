const DEFAULT_NEXT = "/";
const MAX_LENGTH = 2048;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;
const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

function isUnsafe(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) return true;
  if (path.includes("\\")) return true;
  if (CONTROL_CHARS.test(path)) return true;
  if (SCHEME.test(path)) return true;

  // Check the fully decoded value too, so `/%2F%2Fevil.com` cannot become a
  // protocol-relative URL after a downstream decode.
  let decoded = path;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      return true;
    }
  }

  if (!decoded.startsWith("/") || decoded.startsWith("//")) return true;
  if (decoded.includes("\\")) return true;
  if (CONTROL_CHARS.test(decoded)) return true;

  return false;
}

/**
 * Returns a same-origin path safe for a post-login redirect, or `/`. Accepts
 * only a single-leading-slash path. Rejects protocol-relative values,
 * backslashes, schemes, control characters and encoded variants of those.
 */
export function safeNextPath(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_NEXT;

  const candidate = value.trim();
  if (candidate.length === 0 || candidate.length > MAX_LENGTH) {
    return DEFAULT_NEXT;
  }
  if (isUnsafe(candidate)) return DEFAULT_NEXT;

  try {
    const base = "http://localhost";
    const url = new URL(candidate, base);
    if (url.origin !== base) return DEFAULT_NEXT;
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return DEFAULT_NEXT;
    }
  } catch {
    return DEFAULT_NEXT;
  }

  return candidate;
}
