"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Wraps `next-themes` so dark mode is available app-wide. The provider toggles
 * the `.dark` class on <html>, which flips every design token in `globals.css`.
 *
 * Configured once in `AppProviders`; consume the theme with `useTheme()` from
 * `next-themes` in any client component (e.g. a theme switcher).
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
