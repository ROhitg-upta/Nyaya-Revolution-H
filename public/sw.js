// ============================================================================
// NYAYA REVOLUTION — ZERO-TRUST OFFLINE APP SHELL SERVICE WORKER (SPRINT E15)
// Cache Version: nyaya-static-v1
// Strictly caches ONLY safe static shell routes and assets.
// NEVER caches /handoff/*, /api/*, private PDFs, or authenticated mutations.
// ============================================================================

const CACHE_VERSION = "nyaya-static-v1";
const SAFE_STATIC_SHELL_ALLOWLIST = [
  "/action-center",
  "/action-center/case-prep",
  "/learn",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(SAFE_STATIC_SHELL_ALLOWLIST))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((oldKey) => caches.delete(oldKey))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Zero-Trust Exclusion: NEVER intercept or cache tokenized handoffs, APIs, or auth routes
  if (
    url.pathname.startsWith("/handoff/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/moderation") ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up")
  ) {
    return;
  }

  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    SAFE_STATIC_SHELL_ALLOWLIST.includes(url.pathname);

  if (!isStaticAsset) return;

  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      })
      .catch(() => caches.match(req))
  );
});
