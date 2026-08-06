import { Phone } from "@/lib/icons";
import type { EmergencyContact } from "@/types";

/** Emergency contact with a tap-to-call action (uses the tel: scheme). */
export function EmergencyCard({ contact }: { contact: EmergencyContact }) {
  return (
    <a
      href={`tel:${contact.number.replace(/[^0-9+]/g, "")}`}
      className="glass hover:ring-brand/40 focus-visible:ring-ring group flex items-center gap-3 rounded-xl p-3.5 transition-all hover:ring-1 focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="bg-destructive/12 text-destructive flex size-10 shrink-0 items-center justify-center rounded-xl">
        <Phone className="size-5" />
      </span>
      <div className="flex flex-1 flex-col">
        <span className="text-foreground text-sm font-semibold">
          {contact.label}
        </span>
        {contact.description ? (
          <span className="text-muted-foreground text-xs">
            {contact.description}
          </span>
        ) : null}
      </div>
      <span className="text-brand text-base font-bold tabular-nums">
        {contact.number}
      </span>
    </a>
  );
}
