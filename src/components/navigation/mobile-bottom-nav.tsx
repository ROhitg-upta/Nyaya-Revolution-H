"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Compass,
  Scale,
  Sparkles,
  Users,
} from "@/lib/icons";
import { matchActiveNavSection } from "@/constants/navigation";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const activeSection = matchActiveNavSection(pathname);

  const items = [
    {
      id: "home",
      label: "Home",
      href: routes.home,
      icon: Scale,
      active: pathname === "/",
      central: false,
    },
    {
      id: "learn",
      label: "Learn",
      href: routes.learn,
      icon: BookOpen,
      active: activeSection === "learn",
      central: false,
    },
    {
      id: "situations",
      label: "What Happened?",
      href: routes.situations,
      icon: Compass,
      active: activeSection === "situations",
      central: true,
    },
    {
      id: "community",
      label: "Community",
      href: routes.community,
      icon: Users,
      active: activeSection === "community",
      central: false,
    },
    {
      id: "ai",
      label: "Nyaya AI",
      href: routes.ai,
      icon: Sparkles,
      active: activeSection === "ai",
      central: false,
    },
  ] as const;

  return (
    <nav
      aria-label="Mobile Primary Navigation"
      className="border-border/70 bg-background/90 fixed right-0 bottom-0 left-0 z-40 border-t px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 items-center gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          if (item.central) {
            return (
              <li key={item.id} className="flex justify-center">
                <Link
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-2xl px-2.5 py-1.5 text-center transition-all",
                    item.active
                      ? "bg-gradient-brand text-primary-foreground shadow-md"
                      : "bg-brand/12 text-brand hover:bg-brand/20"
                  )}
                >
                  <Icon className="size-4.5" />
                  <span className="mt-0.5 text-[10px] leading-tight font-bold">
                    Triage
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl py-1 text-center transition-colors",
                  item.active
                    ? "text-brand font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span className="mt-0.5 text-[10px] leading-tight font-medium">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
