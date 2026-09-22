import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { routes, siteConfig } from "@/constants";
import { Scale, Search } from "@/lib/icons";

const links = [
  { label: "Situations", href: routes.situations },
  { label: "Laws", href: routes.laws },
  { label: "Learn", href: routes.learn },
  { label: "Scenarios", href: routes.scenarios },
  { label: "Precedents", href: routes.caseStudies },
  { label: "Knowledge", href: routes.knowledge },
  { label: "Glossary", href: routes.glossary },
  { label: "AI Tutor", href: routes.ai },
];

/**
 * Slim app-wide header used on in-product pages (situations, laws, learn, glossary).
 * Distinct from the marketing `LandingNavbar` — no scroll anchors, just top-level nav.
 */
export function AppHeader() {
  return (
    <header className="border-border/50 bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-6">
          <a href={routes.home} className="flex items-center gap-2">
            <span className="bg-gradient-brand glow-brand text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <Scale className="size-4.5" />
            </span>
            <span className="text-foreground text-base font-semibold tracking-tight">
              {siteConfig.name}
            </span>
          </a>
          <ul className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md px-3 py-2 text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={routes.search}
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-lg transition-colors"
            title="Unified Search"
            aria-label="Search"
          >
            <Search className="size-4.5" />
          </a>
          <ThemeToggle />
          <a href={routes.signIn}>
            <Button size="sm" className="glow-hover rounded-full px-5">
              Log in
            </Button>
          </a>
        </div>
      </nav>
    </header>
  );
}
