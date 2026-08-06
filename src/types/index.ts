/**
 * Shared, cross-cutting TypeScript types.
 *
 * Keep domain-specific types close to their feature. Put only genuinely
 * reusable, app-wide types here (utility types, common API envelopes, etc.).
 */

export * from "./auth";
export * from "./onboarding";

/** Makes all properties of T deeply optional. */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** A value that may still be loading / unavailable. */
export type Nullable<T> = T | null;

/** Standard shape for props that accept and render children. */
export type WithChildren<T = unknown> = T & {
  children: React.ReactNode;
};
