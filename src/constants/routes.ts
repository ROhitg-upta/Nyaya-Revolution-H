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
  learn: "/learn",
  learnProfile: "/learn/profile",
  ai: "/ai",
  aiBookmarks: "/ai/bookmarks",
} as const;

export type RouteKey = keyof typeof routes;

/** Builds the detail route for a situation slug. */
export function situationRoute(slug: string): string {
  return `/situations/${slug}`;
}

/** Learning route builders. */
export const aiRoutes = {
  chat: (id: string) => `/ai/chat/${id}`,
} as const;

export const learnRoutes = {
  journey: (slug: string) => `/learn/${slug}`,
  lesson: (journey: string, lesson: string) => `/learn/${journey}/${lesson}`,
  quiz: (journey: string) => `/learn/${journey}/quiz`,
  certificate: (journey: string) => `/learn/${journey}/certificate`,
} as const;
