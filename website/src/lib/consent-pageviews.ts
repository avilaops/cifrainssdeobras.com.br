/** A repeated CMP choice is not another visit to the same page. */
export function createConsentPageViewGate() {
  let lastPath: string | null = null;
  return (path: string, allowed: boolean) => {
    if (!allowed) { lastPath = null; return false; }
    if (lastPath === path) return false;
    lastPath = path;
    return true;
  };
}
