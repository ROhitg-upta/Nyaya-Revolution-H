/**
 * Pure, framework-agnostic helper functions.
 *
 * `utils/` holds small, side-effect-free functions (formatting, math, string
 * helpers). Anything that reaches out to the network or app infrastructure
 * belongs in `services/` or `lib/`, not here.
 */

/** Capitalises the first character of a string. */
export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Formats a number using the app's default locale (Indian English). */
export function formatNumber(value: number, locale = "en-IN"): string {
  return new Intl.NumberFormat(locale).format(value);
}
