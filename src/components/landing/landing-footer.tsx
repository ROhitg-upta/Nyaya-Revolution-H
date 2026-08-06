import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants";
import { footerLinkGroups } from "@/constants/landing";
import {
  type LucideIcon,
  ArrowRight,
  AtSign,
  Globe,
  Mail,
  MessageCircle,
  Scale,
  Send,
} from "@/lib/icons";

const socials: { icon: LucideIcon; label: string }[] = [
  { icon: AtSign, label: "Follow us on X" },
  { icon: MessageCircle, label: "Join the community" },
  { icon: Send, label: "Get updates" },
  { icon: Mail, label: "Email us" },
  { icon: Globe, label: "Visit our website" },
];

export function LandingFooter() {
  return (
    <footer className="border-border/60 border-t">
      {/* Closing CTA */}
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <Reveal className="bg-gradient-brand glow-brand relative overflow-hidden rounded-[2rem] px-8 py-16 text-center shadow-2xl sm:px-16">
          {/* grid + glow overlays */}
          <div
            aria-hidden="true"
            className="bg-grid mask-radial absolute inset-0 opacity-20"
          />
          <div
            aria-hidden="true"
            className="absolute -right-16 -bottom-20 size-72 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -top-20 -left-10 size-64 rounded-full bg-white/10 blur-3xl"
          />
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="text-primary-foreground text-4xl font-bold text-balance sm:text-5xl">
              Know your rights. Change your story.
            </h2>
            <p className="text-primary-foreground/85 text-base sm:text-lg">
              Join a movement making legal awareness accessible to every
              citizen.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="glow-hover rounded-full px-7"
            >
              Start learning free
              <ArrowRight />
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Links */}
      <div className="border-border/60 border-t">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-10 px-5 py-14 sm:px-8 md:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-brand glow-brand text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                <Scale className="size-4.5" />
              </span>
              <span className="text-foreground text-base font-semibold">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <ul className="mt-1 flex items-center gap-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href="#"
                    aria-label={social.label}
                    className="glass text-muted-foreground hover:text-brand focus-visible:ring-ring flex size-9 items-center justify-center rounded-xl transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <social.icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h3 className="text-foreground text-sm font-semibold">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Legal / disclaimer */}
      <div className="border-border/60 border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {siteConfig.name}. Educational content
            only — not a substitute for professional legal advice.
          </p>
          <p className="text-muted-foreground/70 text-xs">
            Made for every citizen · India
          </p>
        </div>
      </div>
    </footer>
  );
}
