/**
 * Protected paths for the course. The prefix test also covers RSC and `.txt`
 * variants, such as `/roadmap.txt`, and keeps sibling paths such as
 * `/about-us` public.
 */
const PROTECTED_ROOTS = ["/lessons", "/roadmap", "/about"] as const;

export function isProtectedPath(pathname: string): boolean {
  const path = pathname.split(/[?#]/, 1)[0] ?? pathname;

  return PROTECTED_ROOTS.some((root) => {
    if (path === root) return true;
    if (path.startsWith(`${root}/`)) return true;
    if (path.startsWith(`${root}.`)) return true;
    return false;
  });
}
