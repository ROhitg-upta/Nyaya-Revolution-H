import type { ReactNode } from "react";

/**
 * Shared shell for all auth screens.
 * Allows edge-to-edge layouts (like Login03 on /sign-in) while supporting
 * centered modal cards via AuthShell.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="relative min-h-svh w-full">{children}</div>;
}
