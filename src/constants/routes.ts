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
} as const;

export type RouteKey = keyof typeof routes;
