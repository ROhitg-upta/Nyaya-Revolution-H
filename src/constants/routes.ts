/**
 * Centralised route map. Reference `routes.signIn` instead of hardcoding path
 * strings so links stay consistent and refactors happen in one place.
 */
export const routes = {
  home: "/",
  welcome: "/welcome",
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  verifyEmail: "/verify-email",
  onboarding: "/onboarding",
  situations: "/situations",
} as const;

export type RouteKey = keyof typeof routes;

/** Builds the detail route for a situation slug. */
export function situationRoute(slug: string): string {
  return `/situations/${slug}`;
}
