"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` only after the component has mounted on the client.
 *
 * Useful for avoiding hydration mismatches when rendering values that differ
 * between server and client (theme, window size, localStorage, etc.).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Intentional mount guard: flipping this flag exactly once after the first
    // client render is the canonical way to defer hydration-sensitive UI.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted;
}
