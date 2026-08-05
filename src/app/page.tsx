import { siteConfig } from "@/constants";

/**
 * Placeholder home route.
 *
 * This is intentionally minimal — the engineering foundation is in place, but
 * no product UI (landing page, dashboard, etc.) is built yet.
 */
export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {siteConfig.name}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Engineering foundation ready.
        </p>
      </div>
    </main>
  );
}
